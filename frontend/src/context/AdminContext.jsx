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
import { fetchStudents } from "../services/studentService.js";
import { getAdminAdmissions } from "../services/admissionService.js";
import { getAllFees } from "../services/feeService.js";
import {
  getPaymentSummary,
  getStudentStats,
} from "../services/reportService.js";
import { getAllPayments } from "../services/paymentService.js";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [students, setStudents] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [fees, setFees] = useState([]);
  const [reports, setReports] = useState({
    payments: { totalPayments: 0, totalCollected: 0 },
    studentStats: [],
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  // ================== Data Loaders ==================
  const loadStudents = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await fetchStudents();
      setStudents(res?.data || []);
      return res;
    } catch (err) {
      showToast("Failed to load students", "error");
    }
  }, [isAdmin, showToast]);

  const loadAdmissions = useCallback(
    async (params) => {
      if (!isAdmin) return;
      try {
        const res = await getAdminAdmissions(params);
        setAdmissions(res?.data || []);
        return res;
      } catch (err) {
        console.error("Error loading admissions:", err);
        showToast(
          err.response?.data?.message || "Failed to load admissions",
          "error"
        );
        setAdmissions([]); // Reset to empty array on error
      }
    },
    [isAdmin, showToast]
  );

  const loadFees = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await getAllFees();
      setFees(res?.data || []);
      return res;
    } catch {
      showToast("Failed to load fees", "error");
    }
  }, [isAdmin, showToast]);

  const loadReports = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [paymentRes, studentRes] = await Promise.all([
        getPaymentSummary(),
        getStudentStats(),
      ]);
      setReports({
        payments: paymentRes?.summary || { totalPayments: 0, totalCollected: 0 },
        studentStats: studentRes?.data || [],
      });
      return { paymentRes, studentRes };
    } catch {
      showToast("Failed to load reports", "error");
    }
  }, [isAdmin, showToast]);

  const loadPayments = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await getAllPayments();
      setPayments(res?.data || []);
      return res;
    } catch {
      showToast("Failed to load payments", "error");
    }
  }, [isAdmin, showToast]);

  // ================== Bootstrap Dashboard ==================
  const bootstrap = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      await Promise.all([
        loadStudents(),
        loadAdmissions(),
        loadFees(),
        loadReports(),
        loadPayments(),
      ]);
      showToast("Admin data loaded successfully", "success");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Unable to load admin dashboard data. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [
    isAdmin,
    loadStudents,
    loadAdmissions,
    loadFees,
    loadReports,
    loadPayments,
    showToast,
  ]);

  // ================== Auto-bootstrap ==================
  useEffect(() => {
    if (isAdmin) bootstrap();
  }, [isAdmin, bootstrap]);

  // ================== Memoized Context Value ==================
  const value = useMemo(
    () => ({
      isAdmin,
      loading,
      students,
      admissions,
      fees,
      reports,
      payments,
      refreshStudents: loadStudents,
      refreshAdmissions: loadAdmissions,
      refreshFees: loadFees,
      refreshReports: loadReports,
      refreshPayments: loadPayments,
    }),
    [
      isAdmin,
      loading,
      students,
      admissions,
      fees,
      reports,
      payments,
      loadStudents,
      loadAdmissions,
      loadFees,
      loadReports,
      loadPayments,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context)
    throw new Error("useAdminContext must be used within an AdminProvider");
  return context;
}
