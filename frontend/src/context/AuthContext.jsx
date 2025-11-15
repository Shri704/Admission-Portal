import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  login as loginApi,
  register as registerApi,
  fetchProfile,
  logout as logoutApi,
} from "../services/authService.js";
import { TOAST_MESSAGES } from "../utils/toastMessages.js";
import useNotification from "../hooks/useNotification.js";

const STORAGE_TOKEN_KEY = "admission_portal_token";
const STORAGE_USER_KEY = "admission_portal_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { showToast } = useNotification();

  // ================== Helpers ==================
  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  }, []);

  // ================== Bootstrap User Session ==================
  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      const storedUserRaw = localStorage.getItem(STORAGE_USER_KEY);
      const storedRole = storedUserRaw ? JSON.parse(storedUserRaw)?.role : null;
      const effectiveRole = storedRole || user?.role;

      if (effectiveRole === "admin") {
        setInitializing(false);
        return;
      }

      try {
        const { data } = await fetchProfile();
        if (data) {
          setUser(data);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));
        }
      } catch (error) {
        console.warn("Failed to hydrate user profile:", error);
        clearSession();
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, [token, clearSession]);

  // ================== Auth Actions ==================
  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        const userData = await loginApi(credentials);
        
        if (!userData?.token) {
          throw new Error("Authentication token missing in response.");
        }

        setUser(userData);
        setToken(userData.token);
        localStorage.setItem(STORAGE_TOKEN_KEY, userData.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));

        showToast(TOAST_MESSAGES.loginSuccess, "success");
        return userData;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to login. Please check your email and password.";
        showToast(message, "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const register = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        const userData = await registerApi(payload);
        
        if (!userData?.token) {
          throw new Error("Registration did not return a token.");
        }

        setUser(userData);
        setToken(userData.token);
        localStorage.setItem(STORAGE_TOKEN_KEY, userData.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));

        showToast(TOAST_MESSAGES.registerSuccess, "success");
        return userData;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to register at the moment.";
        showToast(message, "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      console.warn("Logout API failed silently.");
    } finally {
      clearSession();
      showToast(TOAST_MESSAGES.logoutSuccess, "info");
    }
  }, [clearSession, showToast]);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;

    const storedUserRaw = localStorage.getItem(STORAGE_USER_KEY);
    const storedRole = storedUserRaw ? JSON.parse(storedUserRaw)?.role : null;
    const effectiveRole = storedRole || user?.role;
    if (effectiveRole === "admin") {
      return null;
    }

    try {
      const { data } = await fetchProfile();
      if (data) {
        setUser((prev) => ({ ...prev, ...data }));
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error("Failed to refresh profile", error);
      return null;
    }
  }, [token, user]);

  // ================== Memoized Context Value ==================
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      initializing,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, loading, initializing, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ================== Hook ==================
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
}
