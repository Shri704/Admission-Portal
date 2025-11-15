import PaymentCard from "../../components/common/student/PaymentCard.jsx";
import useStudent from "../../hooks/useStudent.js";

export default function PaymentHistory() {
  const { payments } = useStudent();

  return (
    <div className="space-y-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition-all">
      {/* ================= Header ================= */}
      <header className="border-b border-indigo-100/50 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">
          Review all your past transactions and payment receipts processed through
          Razorpay. You can verify payment IDs and statuses anytime.
        </p>
      </header>

      {/* ================= Payment Cards ================= */}
      <section className="space-y-6">
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 px-8 py-10 text-center text-gray-500 shadow-[0_6px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm">
            <p className="text-sm">No payment records found yet.</p>
            <p className="text-xs mt-1 text-gray-400">
              Once you complete your first payment, it will appear here with receipt details.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PaymentCard payments={payments} />
          </div>
        )}
      </section>
    </div>
  );
}
