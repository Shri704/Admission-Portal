import { formatINR } from "../../../utils/formatCurrency.js";

export default function DashboardStats({
  students = [],
  admissions = [],
  paymentSummary = { totalPayments: 0, totalCollected: 0 },
}) {
  const totalStudents = students.length;
  const pendingAdmissions = admissions.filter(
    (admission) => admission.status === "pending"
  ).length;
  const approvedAdmissions = admissions.filter(
    (admission) => admission.status === "approved"
  ).length;

  const cards = [
    {
      title: "Registered Students",
      value: totalStudents,
      trend: "+12 new this month",
      color: "text-blue-600 bg-blue-50",
      ring: "ring-blue-100",
    },
    {
      title: "Pending Admissions",
      value: pendingAdmissions,
      trend: `${approvedAdmissions} approved`,
      color: "text-yellow-600 bg-yellow-50",
      ring: "ring-yellow-100",
    },
    {
      title: "Payments Collected",
      value: formatINR(paymentSummary.totalCollected || 0),
      trend: `${paymentSummary.totalPayments || 0} transactions`,
      color: "text-green-600 bg-green-50",
      ring: "ring-green-100",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_35px_rgba(59,130,246,0.1)] ring-1 ${card.ring}`}
        >
          <p className="text-sm font-medium text-gray-500">
            {card.title}
          </p>
          <div className="mt-3 text-3xl font-bold text-gray-800 tracking-tight">
            {card.value}
          </div>
          <p
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${card.color} bg-opacity-20`}
          >
            {card.trend}
          </p>
        </div>
      ))}
    </section>
  );
}
