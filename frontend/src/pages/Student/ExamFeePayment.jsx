import { useEffect, useMemo, useState } from "react";
import FeeSummaryCard from "../../components/common/student/FeeSummaryCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import useStudent from "../../hooks/useStudent.js";
import usePayment from "../../hooks/usePayment.js";
import { getStudentFeesByType } from "../../services/feeService.js";
import { YEARS } from "../../utils/constants.js";
import useNotification from "../../hooks/useNotification.js";

export default function ExamFeePayment() {
  const { profile } = useStudent();
  const { initiatePayment, completePayment, processing } = usePayment();
  const { showToast } = useNotification();

  const [selectedYear, setSelectedYear] = useState(() => {
    if (typeof profile?.year === "number") return String(profile.year);
    return "";
  });
  const [paymentMode, setPaymentMode] = useState("full");
  const [feeData, setFeeData] = useState({
    data: [],
    total: 0,
    paid: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (profile?.year && !selectedYear) {
      setSelectedYear(String(profile.year));
    }
  }, [profile?.year, selectedYear]);

  useEffect(() => {
    if (feeData.pending <= 0 && paymentMode !== "full") {
      setPaymentMode("full");
    }
  }, [feeData.pending, paymentMode]);

  const amountToPay = useMemo(() => {
    if (feeData.pending <= 0) return 0;
    if (paymentMode === "half") {
      return Math.max(1, Math.ceil(feeData.pending / 2));
    }
    return feeData.pending;
  }, [feeData.pending, paymentMode]);

  useEffect(() => {
    if (!selectedYear) {
      setFeeData({ data: [], total: 0, paid: 0, pending: 0 });
      return;
    }

    async function loadFees() {
      try {
        setLoading(true);
        const response = await getStudentFeesByType("Exam", {
          year: Number(selectedYear),
        });
        setFeeData({
          data: response.data || [],
          total: response.total || 0,
          paid: response.paid || 0,
          pending:
            typeof response.pending === "number"
              ? response.pending
              : Math.max((response.total || 0) - (response.paid || 0), 0),
        });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Unable to fetch exam fee details for the selected year.";
        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    }

    loadFees();
  }, [selectedYear, showToast, refreshKey]);

  const handlePay = async () => {
    if (!selectedYear) {
      showToast("Select an academic year before making a payment.", "info");
      return;
    }

    if (!feeData.total) {
      showToast("No exam fees found for the selected year.", "info");
      return;
    }

    if (feeData.pending <= 0) {
      showToast("You have already paid the exam fees for this year.", "success");
      return;
    }

    if (!amountToPay || amountToPay <= 0) {
      showToast("No payable amount available for the selected option.", "warning");
      return;
    }

    try {
      const amount = amountToPay;
      const yearNumber = Number(selectedYear);
      const response = await initiatePayment({ amount, year: yearNumber, feeType: "Exam" });
      const { order, keyId, mode } = response;

      if (!order?.id) throw new Error("Payment order creation failed.");

      if (mode === "mock") {
        await completePayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: `mock_${Date.now()}`,
          year: yearNumber,
          amount,
          feeType: "Exam",
        });
        setRefreshKey((prev) => prev + 1);
        return;
      }

      if (!keyId)
        throw new Error("Razorpay configuration missing. Contact administrator.");

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded)
        throw new Error("Unable to load Razorpay checkout. Please retry.");

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "Engineering Admission Portal",
        description: `Exam fee payment for ${selectedYearLabel || `Year ${selectedYear}`}`,
        order_id: order.id,
        handler: async function (paymentResponse) {
          await completePayment({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            amount,
            year: yearNumber,
            feeType: "Exam",
          });
          setRefreshKey((prev) => prev + 1);
        },
        prefill: {
          name: profile?.name,
          email: profile?.email,
          contact: profile?.phone,
        },
        theme: {
          color: "#1e40af",
        },
        method: {
          upi: true, // UPI payment enabled - supports all UPI apps (GPay, PhonePe, Paytm, etc.)
          card: true,
          netbanking: true,
          wallet: true,
        },
        notes: {
          payment_type: "exam_fee",
          year: yearNumber,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () =>
        showToast("Payment failed. Please try again or contact support.", "error")
      );
      razorpay.open();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Payment failed.";
      showToast(message, "error");
    }
  };

  const yearOptions = useMemo(() => YEARS, []);

  const selectedYearLabel = useMemo(() => {
    const match = yearOptions.find(
      (item) => String(item.value) === String(selectedYear)
    );
    return match?.label ?? "";
  }, [selectedYear, yearOptions]);

  if (!profile) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================= Header ================= */}
      <header className="border-b border-indigo-100/50 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
          Exam Fee Payment
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Select your academic year to view and pay exam fees securely through Razorpay.
        </p>
      </header>

      {/* ================= Year Selection ================= */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="form-label mb-0">Academic Year</label>
        <div className="select-wrapper min-w-[200px]">
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="form-control"
          >
            <option value="">Choose Year</option>
            {yearOptions.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= Fee Card / Loader ================= */}
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-2xl bg-white/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
          <FeeSummaryCard
            fees={feeData.data}
            total={feeData.total}
            paid={feeData.paid}
            pending={feeData.pending}
            periodLabel={selectedYearLabel}
            onPay={handlePay}
            loading={processing}
            paymentMode={paymentMode}
            onPaymentModeChange={setPaymentMode}
            payableAmount={amountToPay}
          />
        </div>
      )}
    </div>
  );
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

