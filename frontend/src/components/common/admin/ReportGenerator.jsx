export default function ReportGenerator({
  paymentSummary,
  studentStats = [],
  onRefresh,
  loading,
}) {
  return (
    <section className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-[0_8px_25px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.08)]">
      <div className="flex flex-col gap-6">
        {/* ========== Header ========== */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Analytics Snapshot
            </h3>
            <p className="text-sm text-gray-500">
              Overview of fee collections and student distribution by branch.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-full border border-indigo-600 px-6 py-2 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:scale-105 hover:bg-indigo-600 hover:text-white disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </header>

        {/* ========== Stat Cards ========== */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-50 to-white p-6 transition-all duration-300 hover:shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Total Amount Collected
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              ₹{(paymentSummary?.totalCollected || 0).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Across {paymentSummary?.totalPayments || 0} verified payments
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-50 to-white p-6 transition-all duration-300 hover:shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Active Branches
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {studentStats.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Student count by academic branch
            </p>
          </div>
        </div>

        {/* ========== Branch Distribution Table ========== */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Students</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 bg-white">
              {studentStats.map((stat) => (
                <tr
                  key={stat._id}
                  className="transition-colors hover:bg-indigo-50/40"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {stat._id}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{stat.count}</td>
                </tr>
              ))}

              {studentStats.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No student distribution data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
