import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Digital Admissions",
    description:
      "Submit and track applications, upload documents, and receive decisions online.",
  },
  {
    title: "Secure Payments",
    description:
      "Pay academic, exam, and backlog fees using Razorpay with instant receipts.",
  },
  {
    title: "Admin Dashboard",
    description:
      "Manage student records, approve admissions, and generate insightful reports.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24 bg-gradient-to-br from-gray-50 via-indigo-50 to-blue-50 overflow-hidden">
      {/* ================== Hero Section ================== */}
      <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900 px-8 py-28 text-white shadow-[0_50px_120px_rgba(37,99,235,0.35)] sm:px-12">
        {/* Hero Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute -bottom-12 -right-16 h-80 w-80 rounded-full bg-blue-400/25 blur-[120px]" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-12">
          <div
            className="flex-1 space-y-7 animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <span className="inline-flex rounded-full bg-white/15 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-white/90 backdrop-blur-md border border-white/10">
              Engineering Admission Portal
            </span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl drop-shadow-xl">
              Streamline Admissions, Documents & Fees — All in One Platform.
            </h1>
            <p className="max-w-2xl text-base text-white/90 sm:text-lg">
              A unified digital ecosystem empowering institutions to manage
              admissions, payments, and student data seamlessly — ensuring clarity,
              speed, and trust for every stakeholder.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-3">
              <Link
                to="/student/register"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-indigo-100"
              >
                Student Registration
              </Link>
              <Link
                to="/admin/login"
                className="rounded-full border border-white/70 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Highlights Section ================== */}
      <section className="max-w-7xl mx-auto grid gap-10 px-6 sm:px-10 md:grid-cols-3">
        {highlights.map((item, i) => (
          <article
            key={item.title}
            className="group relative overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 text-dark shadow-[0_25px_60px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(37,99,235,0.18)] animate-fade-in-up"
            style={{ animationDelay: `${0.2 * (i + 1)}s` }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-100 to-blue-200 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
            <div className="relative z-10 space-y-3">
              <h3 className="text-lg font-semibold text-indigo-700">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* ================== CTA Section ================== */}
      <section className="relative max-w-7xl mx-auto overflow-hidden rounded-[36px] bg-white/95 p-12 shadow-[0_40px_100px_rgba(37,99,235,0.15)] backdrop-blur-md">
        {/* Background gradients */}
        <div className="absolute -top-14 -right-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative grid items-center gap-14 md:grid-cols-2">
          {/* Left Side */}
          <div
            className="space-y-5 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Why Institutions Choose Our Portal
            </h2>
            <ul className="space-y-3 text-gray-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_0_6px_rgba(59,130,246,0.12)]"></span>
                Role-based dashboards for admins & students with complete transparency.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_0_6px_rgba(59,130,246,0.12)]"></span>
                Integrated document management powered by Cloudinary for secure uploads.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_0_6px_rgba(59,130,246,0.12)]"></span>
                Razorpay integration with auto-verification and instant receipts.
              </li>
            </ul>
          </div>

          {/* Right Side */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="space-y-6 rounded-3xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-10 shadow-inner hover:shadow-[0_20px_60px_rgba(37,99,235,0.1)] transition-all">
              <h3 className="text-xl font-semibold text-indigo-700">
                Ready to Digitize Admissions?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Start your institution’s digital transformation in minutes with guided onboarding.
                Configure academic years, import data, and automate fee management effortlessly.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-500"
              >
                Connect with Support →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================== Footer Note ================== */}
      <footer className="max-w-7xl mx-auto text-center text-sm text-gray-500 pb-10">
        © {new Date().getFullYear()} Engineering Admission Portal — Empowering Institutions Digitally.
      </footer>
    </div>
  );
}
