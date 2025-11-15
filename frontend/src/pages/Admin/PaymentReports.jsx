import PaymentTable from "../../components/common/admin/PaymentTable.jsx";
import useAdmin from "../../hooks/useAdmin.js";
import useNotification from "../../hooks/useNotification.js";

export default function PaymentReports() {
  const { payments, refreshPayments } = useAdmin();
  const { showToast } = useNotification();

  const handleExport = () => {
    if (!payments.length) {
      showToast("No payments to export.", "info");
      return;
    }

    const csvRows = [
      ["Student", "Email", "Order ID", "Payment ID", "Amount", "Status", "Date"],
      ...payments.map((payment) => [
        payment.studentId?.name || "NA",
        payment.studentId?.email || "NA",
        payment.orderId,
        payment.paymentId,
        payment.amount,
        payment.status,
        new Date(payment.paymentDate).toLocaleString(),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Payment report exported as CSV.", "success");
  };

  const handleRefresh = async () => {
    try {
      await refreshPayments();
      showToast("Payment data refreshed successfully.", "success");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to refresh payment data.";
      showToast(message, "error");
    }
  };

  return (
    <div className="space-y-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================= Header ================= */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-indigo-100/50 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
            Payment Reports
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review and export all Razorpay transactions for reconciliation and analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-[0.97]"
          >
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition-all hover:shadow-[0_14px_40px_rgba(37,99,235,0.35)] active:scale-[0.98]"
          >
            Export CSV
          </button>
        </div>
      </header>

      {/* ================= Payment Table ================= */}
      <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        <PaymentTable payments={payments} />
      </section>
    </div>
  );
}
