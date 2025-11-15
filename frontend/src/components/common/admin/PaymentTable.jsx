import { formatINR } from "../../../utils/formatCurrency.js";

export default function PaymentTable({ payments = [] }) {
  return (
    <section className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-[0_8px_25px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.08)]">
      <div className="flex flex-col gap-6">
        {/* ========== Header ========== */}
        <header>
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Payments
          </h3>
          <p className="text-sm text-gray-500">
            List of payments recorded through the admission portal.
          </p>
        </header>

        {/* ========== Table ========== */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 bg-white">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="transition-all hover:bg-indigo-50/40"
                >
                  {/* Student Info */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">
                      {payment.studentId?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.studentId?.email}
                    </div>
                  </td>

                  {/* Order ID */}
                  <td className="px-4 py-3 text-gray-700">
                    {payment.orderId}
                  </td>

                  {/* Payment ID */}
                  <td className="px-4 py-3 text-gray-700">
                    {payment.paymentId || "N/A"}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-semibold text-indigo-600">
                    {formatINR(payment.amount)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        payment.status === "success"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "created"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No payments recorded yet.
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
