import DashboardStats from "../../components/common/admin/DashboardStats.jsx";
import ReportGenerator from "../../components/common/admin/ReportGenerator.jsx";
import PaymentTable from "../../components/common/admin/PaymentTable.jsx";
import Loader from "../../components/common/Loader.jsx";
import useAdmin from "../../hooks/useAdmin.js";

export default function AdminDashboard() {
  const {
    loading,
    students,
    admissions,
    reports,
    payments,
    refreshReports,
  } = useAdmin();

  if (loading && students.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-10 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 p-6 shadow-[0_10px_40px_rgba(37,99,235,0.08)] sm:p-8 md:p-10">
      {/* ================== Header ================== */}
      <header className="border-b border-indigo-100/50 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
          Admin Dashboard
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-gray-600">
          Monitor student registrations, admission requests, and financial
          performance of the institution — all in one place.
        </p>
      </header>

      {/* ================== Stats Section ================== */}
      <section className="animate-fade-in-up">
        <DashboardStats
          students={students}
          admissions={admissions}
          paymentSummary={reports.payments}
        />
      </section>

      {/* ================== Reports Section ================== */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <ReportGenerator
          paymentSummary={reports.payments}
          studentStats={reports.studentStats}
          onRefresh={refreshReports}
          loading={loading}
        />
      </section>

      {/* ================== Recent Payments ================== */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-xl font-semibold text-dark">Recent Payments</h2>
          <p className="text-sm text-gray-500">
            Showing last {Math.min(6, payments.length)} transactions
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-white/90 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.1)]">
          <PaymentTable payments={payments.slice(0, 6)} />
        </div>
      </section>
    </div>
  );
}
