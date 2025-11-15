import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAuth from "../hooks/useAuth.js";
import useNotification from "../hooks/useNotification.js";

import {
  getStudentProfile,
  updateStudentProfile,
} from "../services/studentService.js";
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
} from "../services/documentService.js";
import {
  applyAdmission,
  getAdmissionHistory,
} from "../services/admissionService.js";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
} from "../services/paymentService.js";

import { TOAST_MESSAGES } from "../utils/toastMessages.js";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const isStudent = user?.role === "student";

  // ================== LOADERS ==================
  const loadProfile = useCallback(async () => {
    if (!isStudent) return null;
    try {
      const res = await getStudentProfile();
      setProfile(res?.data || null);
      return res?.data;
    } catch (err) {
      showToast("Failed to load student profile.", "error");
      return null;
    }
  }, [isStudent, showToast]);

  const loadDocuments = useCallback(async () => {
    if (!isStudent) return null;
    try {
      const res = await fetchDocuments();
      setDocuments(res?.data || []);
      return res?.data;
    } catch (err) {
      showToast("Failed to load documents.", "error");
      return [];
    }
  }, [isStudent, showToast]);

  const loadAdmissions = useCallback(async () => {
    if (!isStudent) return null;
    try {
      const res = await getAdmissionHistory();
      setAdmissions(res?.data || []);
      return res?.data;
    } catch (err) {
      showToast("Failed to load admission data.", "error");
      return [];
    }
  }, [isStudent, showToast]);

  const loadPayments = useCallback(async () => {
    if (!isStudent) return null;
    try {
      const res = await getPaymentHistory();
      setPayments(res?.data || []);
      return res?.data;
    } catch (err) {
      showToast("Failed to load payment history.", "error");
      return [];
    }
  }, [isStudent, showToast]);

  // ================== INITIAL BOOTSTRAP ==================
  const bootstrap = useCallback(async () => {
    if (!isStudent) return;
    try {
      setLoading(true);
      await Promise.all([
        loadProfile(),
        loadDocuments(),
        loadAdmissions(),
        loadPayments(),
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to load student dashboard details.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [isStudent, loadProfile, loadDocuments, loadAdmissions, loadPayments, showToast]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // ================== MUTATIONS ==================
  const saveProfile = useCallback(
    async (updates) => {
      try {
        const res = await updateStudentProfile(updates);
        setProfile(res?.data);
        showToast("Profile updated successfully.", "success");
        return res?.data;
      } catch (err) {
        showToast("Failed to update profile.", "error");
        throw err;
      }
    },
    [showToast]
  );

  const addDocument = useCallback(
    async (payload) => {
      try {
        const res = await uploadDocument(payload);
        // Check if document already exists (update) or is new (add)
        setDocuments((prev) => {
          const existingIndex = prev.findIndex(
            (doc) => doc.docType === res?.data?.docType && doc.studentId === res?.data?.studentId
          );
          if (existingIndex >= 0) {
            // Update existing document
            const updated = [...prev];
            updated[existingIndex] = res.data;
            return updated;
          }
          // Add new document
          return [res?.data, ...prev];
        });
        showToast(res?.data?.message || TOAST_MESSAGES.documentUploaded, "success");
        return res?.data;
      } catch (err) {
        const errorMessage = err?.response?.data?.message || err?.message || "Document upload failed.";
        showToast(errorMessage, "error");
        throw err;
      }
    },
    [showToast]
  );

  const removeDocument = useCallback(
    async (id) => {
      try {
        await deleteDocument(id);
        setDocuments((prev) => prev.filter((doc) => doc._id !== id));
        showToast("Document deleted.", "info");
      } catch (err) {
        showToast("Failed to delete document.", "error");
      }
    },
    [showToast]
  );

  const submitAdmission = useCallback(
    async (payload) => {
      try {
        const res = await applyAdmission(payload);
        await loadAdmissions();
        showToast(TOAST_MESSAGES.admissionSubmitted, "success");
        return res?.data;
      } catch (err) {
        showToast("Admission submission failed.", "error");
        throw err;
      }
    },
    [loadAdmissions, showToast]
  );

  // ================== PAYMENTS ==================
  const createOrder = useCallback(async (payload) => {
    try {
      const res = await createPaymentOrder(payload);
      return res;
    } catch (err) {
      showToast("Failed to initiate payment.", "error");
      throw err;
    }
  }, [showToast]);

  const confirmPayment = useCallback(
    async (payload) => {
      try {
        const res = await verifyPayment(payload);
        await loadPayments();
        showToast(TOAST_MESSAGES.paymentSuccess, "success");
        return res?.data;
      } catch (err) {
        showToast(TOAST_MESSAGES.paymentFailed, "error");
        throw err;
      }
    },
    [loadPayments, showToast]
  );

  // ================== CONTEXT VALUE ==================
  const value = useMemo(
    () => ({
      isStudent,
      loading,
      profile,
      documents,
      admissions,
      payments,
      refreshProfile: loadProfile,
      refreshDocuments: loadDocuments,
      refreshAdmissions: loadAdmissions,
      refreshPayments: loadPayments,
      saveProfile,
      addDocument,
      removeDocument,
      submitAdmission,
      createOrder,
      confirmPayment,
    }),
    [
      isStudent,
      loading,
      profile,
      documents,
      admissions,
      payments,
      loadProfile,
      loadDocuments,
      loadAdmissions,
      loadPayments,
      saveProfile,
      addDocument,
      removeDocument,
      submitAdmission,
      createOrder,
      confirmPayment,
    ]
  );

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const ctx = useContext(StudentContext);
  if (!ctx)
    throw new Error("useStudentContext must be used within StudentProvider");
  return ctx;
}
