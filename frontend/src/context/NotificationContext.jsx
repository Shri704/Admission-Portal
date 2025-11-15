import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { fetchNotifications as fetchNotificationApi } from "../services/notificationService.js";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================== Toast Management ==================
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);

      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-remove toast safely after duration
      const timer = setTimeout(() => removeToast(id), duration);
      return () => clearTimeout(timer);
    },
    [removeToast]
  );

  // ================== Notification Fetcher ==================
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchNotificationApi();
      setNotifications(res?.data || []);
    } catch (err) {
      console.warn("⚠️ Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================== Memoized Context Value ==================
  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
      notifications,
      fetchNotifications,
      loading,
    }),
    [toasts, showToast, removeToast, notifications, fetchNotifications, loading]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ================== Hook ==================
export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  return ctx;
}
