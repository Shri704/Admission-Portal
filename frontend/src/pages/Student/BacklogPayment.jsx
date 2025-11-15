import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader.jsx";
import usePayment from "../../hooks/usePayment.js";
import useNotification from "../../hooks/useNotification.js";
import useStudent from "../../hooks/useStudent.js";
import {
  getBacklogSubjects,
  getBacklogFeeAmount,
  createBacklogSubjects,
  deleteBacklogSubject,
} from "../../services/backlogSubjectService.js";
import { useBranches } from "../../context/BranchesContext.jsx";
import { SEMESTERS } from "../../utils/constants.js";

export default function BacklogPayment() {
  const { profile } = useStudent();
  const { initiatePayment, completePayment, processing } = usePayment();
  const { showToast } = useNotification();
  const { branchesForSelect } = useBranches();

  const [backlogSubjects, setBacklogSubjects] = useState([]);
  const [perBacklogAmount, setPerBacklogAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Form state for adding new subject
  const [subjectForm, setSubjectForm] = useState({
    subjectCode: "",
    subjectName: "",
    branch: profile?.branch || "",
    semester: "",
    usn: profile?.usn || "",
  });

  // Load backlog subjects and fee amount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [subjectsRes, feeRes] = await Promise.all([
          getBacklogSubjects({ paid: false }),
          getBacklogFeeAmount(),
        ]);
        setBacklogSubjects(subjectsRes?.data || []);
        setPerBacklogAmount(feeRes?.perBacklogAmount || 0);
      } catch (error) {
        console.error("Error loading backlog data:", error);
        showToast(
          error.response?.data?.message || "Failed to load backlog information",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshKey, showToast]);

  // Update form with profile data
  useEffect(() => {
    if (profile) {
      setSubjectForm((prev) => ({
        ...prev,
        branch: profile.branch || prev.branch,
        usn: profile.usn || prev.usn,
      }));
    }
  }, [profile]);

  const unpaidSubjects = useMemo(
    () => backlogSubjects.filter((s) => !s.paid),
    [backlogSubjects]
  );

  const totalAmount = useMemo(
    () => unpaidSubjects.length * perBacklogAmount,
    [unpaidSubjects.length, perBacklogAmount]
  );

  const handleAddSubject = async (event) => {
    event.preventDefault();
    const { subjectCode, subjectName, branch, semester, usn } = subjectForm;

    if (!subjectCode || !subjectName || !branch || !semester || !usn) {
      showToast("Please fill all fields", "warning");
      return;
    }

    try {
      setAddingSubject(true);
      const response = await createBacklogSubjects([
        {
          subjectCode,
          subjectName,
          branch,
          semester: Number(semester),
          usn,
        },
      ]);

      if (response?.data && response.data.length > 0) {
        showToast("Backlog subject added successfully", "success");
        setSubjectForm({
          subjectCode: "",
          subjectName: "",
          branch: profile?.branch || "",
          semester: "",
          usn: profile?.usn || "",
        });
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add backlog subject";
      showToast(message, "error");
    } finally {
      setAddingSubject(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm("Are you sure you want to remove this backlog subject?")) {
      return;
    }

    try {
      await deleteBacklogSubject(id);
      showToast("Backlog subject removed", "success");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to remove backlog subject";
      showToast(message, "error");
    }
  };

  const handlePay = async () => {
    if (unpaidSubjects.length === 0) {
      showToast("No unpaid backlog subjects to pay", "info");
      return;
    }

    if (perBacklogAmount <= 0) {
      showToast("Backlog fee amount not configured. Please contact admin.", "warning");
      return;
    }

    if (totalAmount <= 0) {
      showToast("Invalid amount to pay", "warning");
      return;
    }

    const yearNumber = profile?.year || 1;
    if (![1, 2, 3, 4].includes(yearNumber)) {
      showToast("Your academic year is not set. Please update your profile.", "error");
      return;
    }

    try {
      const amount = totalAmount;
      const response = await initiatePayment({ amount, year: yearNumber, feeType: "Backlog" });
      const { order, keyId, mode } = response;

      if (!order?.id) {
        throw new Error("Failed to create backlog payment order.");
      }

      if (mode === "mock") {
        await completePayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: `mock_${Date.now()}`,
          year: yearNumber,
          amount,
          feeType: "Backlog",
          backlogSubjectIds: unpaidSubjects.map((s) => s._id),
        });
        setRefreshKey((prev) => prev + 1);
        return;
      }

      if (!keyId) {
        throw new Error("Razorpay configuration missing. Contact administrator.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "Engineering Admission Portal",
        description: `Backlog fee payment for ${unpaidSubjects.length} subject${unpaidSubjects.length > 1 ? "s" : ""}`,
        order_id: order.id,
        handler: async (paymentResponse) => {
          await completePayment({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            amount,
            year: yearNumber,
            feeType: "Backlog",
            backlogSubjectIds: unpaidSubjects.map((s) => s._id),
          });
          setRefreshKey((prev) => prev + 1);
        },
        prefill: {
          name: profile?.name,
          email: profile?.email,
          contact: profile?.phone,
        },
        theme: { color: "#1e40af" },
        method: {
          upi: true, // UPI payment enabled - supports all UPI apps (GPay, PhonePe, Paytm, etc.)
          card: true,
          netbanking: true,
          wallet: true,
        },
        notes: {
          payment_type: "backlog_fee",
          backlog_count: unpaidSubjects.length,
          year: yearNumber,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        showToast("Backlog payment failed. Please retry.", "error");
      });
      razorpay.open();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to process backlog payment.";
      showToast(message, "error");
    }
  };

  if (!profile) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <header className="border-b border-indigo-100/50 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
          Backlog Payment
        </h1>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">
          Add your backlog subjects and pay the fees. Amount per backlog: ₹{perBacklogAmount || "Not configured"}
        </p>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {/* Add Subject Form */}
          <div className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add Backlog Subject
            </h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    value={subjectForm.subjectCode}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, subjectCode: e.target.value.toUpperCase() })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="e.g., CS301"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={subjectForm.subjectName}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, subjectName: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="e.g., Data Structures"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch *
                  </label>
                  <select
                    value={subjectForm.branch}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, branch: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branchesForSelect.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester *
                  </label>
                  <select
                    value={subjectForm.semester}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, semester: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    required
                  >
                    <option value="">Select Semester</option>
                    {SEMESTERS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    USN *
                  </label>
                  <input
                    type="text"
                    value={subjectForm.usn}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, usn: e.target.value.toUpperCase() })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="e.g., 1AB20CS001"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingSubject}
                  className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition-all hover:shadow-[0_14px_40px_rgba(37,99,235,0.35)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {addingSubject ? "Adding..." : "Add Subject"}
                </button>
              </div>
            </form>
          </div>

          {/* Backlog Subjects List */}
          {unpaidSubjects.length > 0 && (
            <div className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Unpaid Backlog Subjects ({unpaidSubjects.length})
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Amount per backlog: ₹{perBacklogAmount}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    Total: ₹{totalAmount}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {unpaidSubjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {subject.subjectCode} - {subject.subjectName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {subject.branch} | Semester {subject.semester} | USN: {subject.usn}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSubject(subject._id)}
                      className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handlePay}
                  disabled={processing || totalAmount <= 0 || perBacklogAmount <= 0}
                  className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition-all hover:shadow-[0_14px_40px_rgba(37,99,235,0.35)] active:scale-[0.98] disabled:opacity-60"
                >
                  {processing
                    ? "Processing..."
                    : `Pay ₹${totalAmount} for ${unpaidSubjects.length} backlog${unpaidSubjects.length > 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          )}

          {unpaidSubjects.length === 0 && (
            <div className="rounded-2xl bg-white/90 p-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md text-center">
              <p className="text-gray-600">
                No unpaid backlog subjects. Add subjects above to proceed with payment.
              </p>
            </div>
          )}
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
