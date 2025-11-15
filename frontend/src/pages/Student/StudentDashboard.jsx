import { useMemo } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader.jsx";
import useStudent from "../../hooks/useStudent.js";
import { formatINR } from "../../utils/formatCurrency.js";
import defaultAvatar from "../../assets/defaultProfile.jpg";
import { DOCUMENT_TYPES, REQUIRED_DOCUMENT_TYPES } from "../../utils/constants.js";

export default function StudentDashboard() {
  const { profile, admissions, documents, payments, loading } = useStudent();
  const normalizedDocuments = documents ?? [];
  const normalizedPayments = payments ?? [];
  const normalizedAdmissions = admissions ?? [];
  const showInitialLoader = loading && !profile;

  const latestAdmission = normalizedAdmissions?.[0];
  const latestPayment = normalizedPayments?.[0];

  const profilePhotoDoc = useMemo(
    () => normalizedDocuments.find((doc) => doc.docType === "Photo"),
    [normalizedDocuments]
  );

  const profilePhoto = profile?.photoUrl || profilePhotoDoc?.fileUrl || defaultAvatar;

  const uploadedDocTypes = useMemo(
    () => new Set(normalizedDocuments.map((doc) => doc.docType)),
    [normalizedDocuments]
  );

  const missingRequiredDocs = useMemo(
    () => REQUIRED_DOCUMENT_TYPES.filter((type) => !uploadedDocTypes.has(type)),
    [uploadedDocTypes]
  );

  const missingDocLabels = useMemo(
    () =>
      missingRequiredDocs.map(
        (type) => DOCUMENT_TYPES.find((item) => item.value === type)?.label ?? type
      ),
    [missingRequiredDocs]
  );

  const hasAllRequiredDocs = missingRequiredDocs.length === 0;
  const requiredProgress = REQUIRED_DOCUMENT_TYPES.length
    ? (REQUIRED_DOCUMENT_TYPES.length - missingRequiredDocs.length) /
      REQUIRED_DOCUMENT_TYPES.length
    : 1;

  const quickTasks = useMemo(() => {
    const tasks = [];
    if (!hasAllRequiredDocs) {
      tasks.push({
        label: "Upload remaining mandatory documents",
        actionLabel: "Upload now",
        to: "/student/upload-documents",
      });
    }
    if (!profile?.phone) {
      tasks.push({
        label: "Add your contact number",
        actionLabel: "Update profile",
        to: "/student/profile",
      });
    }
    if (!profile?.usn) {
      tasks.push({
        label: "Enter your USN once allotted",
        actionLabel: "Update profile",
        to: "/student/profile",
      });
    }
    return tasks;
  }, [hasAllRequiredDocs, profile?.phone, profile?.usn]);

  if (showInitialLoader) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition-all">
      {/* ======== HERO / PROFILE SUMMARY ======== */}
      <section className="rounded-3xl bg-white/90 p-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)] transition">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
            <img
              src={profilePhoto}
              alt={profile?.name || "Student profile"}
              className="h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-indigo-100"
            />

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-dark drop-shadow-sm">
                Welcome back, {profile?.name || "Student"}!
              </h1>
              <p className="text-sm text-gray-600 max-w-xl">
                Track your admission status, keep documents verified, and stay current on fee
                payments — everything you need for a smooth admission journey.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                  {profile?.branch || "Branch not set"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow-sm">
                  {profile?.admissionStatus ?? "pending"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  Year {profile?.year ?? "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {hasAllRequiredDocs ? (
              <Link
                to="/student/admission-form"
                className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] transition hover:bg-[#1e40af] hover:shadow-[0_12px_36px_rgba(37,99,235,0.35)] hover:scale-105 text-center"
              >
                Start Admission Form
              </Link>
            ) : (
              <button
                type="button"
                className="rounded-full bg-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 shadow-inner"
                title="Upload required documents to unlock the admission form"
                disabled
              >
                Upload documents to unlock form
              </button>
            )}

            <Link
              to="/student/upload-documents"
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] transition hover:bg-[#1e40af] hover:shadow-[0_12px_36px_rgba(37,99,235,0.35)] hover:scale-105 text-center"
            >
              Upload Documents
            </Link>

            <Link
              to="/student/fee-payment"
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] transition hover:bg-[#1e40af] hover:shadow-[0_12px_36px_rgba(37,99,235,0.35)] hover:scale-105 text-center"
            >
              Pay Academic Fees
            </Link>
            <Link
              to="/student/exam-fee-payment"
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] transition hover:bg-[#1e40af] hover:shadow-[0_12px_36px_rgba(37,99,235,0.35)] hover:scale-105 text-center"
            >
              Pay Exam Fees
            </Link>
            <Link
              to="/student/backlog-payment"
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] transition hover:bg-[#1e40af] hover:shadow-[0_12px_36px_rgba(37,99,235,0.35)] hover:scale-105 text-center"
            >
              Pay Backlog Fees
            </Link>
          </div>
        </div>

        {quickTasks.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <h2 className="text-sm font-semibold text-amber-900">Action items</h2>
            <ul className="mt-2 space-y-2 text-sm text-amber-800">
              {quickTasks.map((task, index) => (
                <li key={`${task.label}-${index}`} className="flex flex-wrap items-center gap-2">
                  <span>• {task.label}</span>
                  {task.to && (
                    <Link
                      to={task.to}
                      className="text-xs font-semibold uppercase tracking-wide text-amber-900 underline"
                    >
                      {task.actionLabel}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!hasAllRequiredDocs && (
          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-rose-800">
            <p className="font-semibold">Mandatory documents pending:</p>
            <p>{missingDocLabels.join(", ")}</p>
          </div>
        )}
      </section>

      {/* ======== SUMMARY CARDS ======== */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* Admission Status */}
        <article className="rounded-2xl bg-white/90 p-6 shadow-md backdrop-blur-md hover:shadow-lg transition">
          <p className="text-sm font-medium text-gray-500">Admission Status</p>
          <p className="mt-2 text-lg font-semibold text-dark">
            {profile?.admissionStatus || "Pending"}
          </p>
          {latestAdmission ? (
            <p className="mt-1 text-xs text-gray-400">
              Last updated: {new Date(latestAdmission.updatedAt).toLocaleDateString()}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              Submit your admission form to get started.
            </p>
          )}
        </article>

        {/* Documents */}
        <article className="rounded-2xl bg-white/90 p-6 shadow-md backdrop-blur-md hover:shadow-lg transition">
          <p className="text-sm font-medium text-gray-500">Documents</p>
          <p className="mt-2 text-lg font-semibold text-dark">{documents.length} uploaded</p>
          <p className="mt-1 text-xs text-gray-400">
            {hasAllRequiredDocs
              ? "All mandatory documents submitted."
              : `${missingRequiredDocs.length} mandatory document${missingRequiredDocs.length > 1 ? "s" : ""} pending.`}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${Math.max(6, requiredProgress * 100)}%` }}
            />
          </div>
        </article>

        {/* Last Payment */}
        <article className="rounded-2xl bg-white/90 p-6 shadow-md backdrop-blur-md hover:shadow-lg transition">
          <p className="text-sm font-medium text-gray-500">Last Payment</p>
          <p className="mt-2 text-lg font-semibold text-dark">
            {latestPayment ? formatINR(latestPayment.amount) : "Not paid"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {latestPayment
              ? `Transaction ID: ${latestPayment.paymentId || "Pending"}`
              : "Complete your fee payment online."}
          </p>
        </article>
      </section>

      {/* ======== ADMISSION HISTORY + PAYMENT ACTIVITY ======== */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* Admission History */}
        <div className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)] transition">
          <div className="flex items-center justify-between border-b border-gray-100/70 pb-3">
            <h3 className="text-lg font-semibold text-dark">Admission History</h3>
            <Link to="/student/admission-form" className="text-sm font-semibold text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {admissions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No admission records found.
              </p>
            ) : (
              admissions.map((admission) => (
                <div
                  key={admission._id}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 backdrop-blur-sm hover:bg-gray-100/80 transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-dark">
                      Year {admission.year} — {admission.branch}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        admission.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : admission.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {admission.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Submitted on {new Date(admission.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Activity */}
        <div className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)] transition">
          <div className="flex items-center justify-between border-b border-gray-100/70 pb-3">
            <h3 className="text-lg font-semibold text-dark">Payment Activity</h3>
            <Link to="/student/payment-history" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {payments.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No payments have been recorded yet.
              </p>
            ) : (
              payments.slice(0, 4).map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 backdrop-blur-sm hover:bg-gray-100/80 transition"
                >
                  <div>
                    <p className="text-sm font-semibold text-dark">{formatINR(payment.amount)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      payment.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
