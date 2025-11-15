import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useNotification from "../hooks/useNotification.js";
import { TOAST_MESSAGES } from "../utils/toastMessages.js";
import { useStudentContext } from "./StudentContext.jsx";

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const { showToast } = useNotification();
  const { createOrder, confirmPayment, refreshPayments } = useStudentContext();

  const [currentOrder, setCurrentOrder] = useState(null);
  const [processing, setProcessing] = useState(false);

  // ================== Step 1: Initiate Payment ==================
  const initiatePayment = useCallback(
    async ({ amount, year, feeType }) => {
      try {
        setProcessing(true);
        const res = await createOrder({ amount, year, feeType });
        if (!res) throw new Error("Failed to create payment order.");
        setCurrentOrder(res);
        return res;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to initiate payment.";
        showToast(message, "error");
        throw error;
      } finally {
        setProcessing(false);
      }
    },
    [createOrder, showToast]
  );

  // ================== Step 2: Complete Payment ==================
  const completePayment = useCallback(
    async (payload) => {
      try {
        setProcessing(true);
        const result = await confirmPayment(payload);
        await refreshPayments();
        showToast(TOAST_MESSAGES.paymentSuccess, "success");
        setCurrentOrder(null);
        return result;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          TOAST_MESSAGES.paymentFailed ||
          "Payment verification failed.";
        showToast(message, "error");
        throw error;
      } finally {
        setProcessing(false);
      }
    },
    [confirmPayment, refreshPayments, showToast]
  );

  // ================== Step 3: Reset Payment ==================
  const resetOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  // ================== Memoized Context Value ==================
  const value = useMemo(
    () => ({
      currentOrder,
      processing,
      initiatePayment,
      completePayment,
      resetOrder,
    }),
    [currentOrder, processing, initiatePayment, completePayment, resetOrder]
  );

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

// ================== Hook ==================
export function usePaymentContext() {
  const ctx = useContext(PaymentContext);
  if (!ctx)
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  return ctx;
}
