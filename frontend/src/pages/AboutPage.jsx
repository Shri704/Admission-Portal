const milestones = [
  {
    year: "2022",
    title: "Idea & Research",
    description:
      "Collaborated with engineering colleges to document challenges in manual admissions.",
  },
  {
    year: "2023",
    title: "Portal Launch",
    description:
      "Released the first version with student onboarding, admissions, and fee payments.",
  },
  {
    year: "2024",
    title: "Automation Suite",
    description:
      "Introduced automated notifications, analytics dashboards, and payment reconciliation.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[90vh] space-y-16 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-10 md:p-14 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all">
      {/* ===== HEADER ===== */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight drop-shadow-sm">
          About the Portal
        </h1>
        <p className="mx-auto max-w-3xl text-base text-gray-600 leading-relaxed">
          We built the <span className="font-semibold text-primary">Engineering Admission Portal</span> to remove friction across admissions,
          finance, and document workflows — enabling institutes to support students with clarity,
          transparency, and speed.
        </p>
      </header>

      {/* ===== INTRO SECTION ===== */}
      <section className="rounded-3xl bg-white/90 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-md space-y-6 transition hover:shadow-[0_32px_80px_rgba(37,99,235,0.2)]">
        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-base leading-relaxed text-gray-700">
            The platform orchestrates student onboarding, document verification, fee payments, and
            administrative approvals through a cohesive digital experience. Real-time dashboards,
            actionable notifications, and guided workflows keep institutes and applicants aligned at
            every milestone.
          </p>
          <p className="text-base leading-relaxed text-gray-700">
            Built on a resilient MERN stack foundation, the portal emphasizes compliance,
            observability, and modular growth. Role-based access, Cloudinary-backed document
            storage, and Razorpay-powered payments form a foundation designed for institutional scale.
          </p>
        </div>
      </section>

      {/* ===== MILESTONES ===== */}
      <section className="space-y-10">
        <h2 className="text-2xl font-semibold text-dark text-center">Our Journey</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {milestones.map((item, index) => (
            <article
              key={item.year}
              className="rounded-3xl bg-white/90 p-6 shadow-soft backdrop-blur-md animate-fade-in-up transition hover:scale-[1.03] hover:shadow-[0_20px_55px_rgba(99,102,241,0.2)]"
              style={{ animationDelay: `${0.15 * (index + 1)}s` }}
            >
              <p className="text-sm font-bold text-primary">{item.year}</p>
              <h3 className="mt-1 text-lg font-semibold text-dark">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== CORE PILLARS ===== */}
      <section className="rounded-3xl bg-white/90 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-md space-y-8 hover:shadow-[0_32px_80px_rgba(37,99,235,0.2)] transition">
        <h2 className="text-2xl font-semibold text-dark text-center">
          Core Pillars
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "Transparency",
              description:
                "Admission updates and fee events are traceable with approvals, timestamps, and activity logs for total visibility.",
            },
            {
              title: "Security",
              description:
                "End-to-end encryption, JWT authentication, and fine-grained role-based access ensure every transaction is secure.",
            },
            {
              title: "Scalability",
              description:
                "Modular architecture, async queues, and optimized database models sustain smooth performance during peak admissions.",
            },
          ].map((pillar, index) => (
            <article
              key={pillar.title}
              className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white/90 to-indigo-50/70 p-6 shadow-soft animate-fade-in-up transition hover:scale-[1.03] hover:shadow-[0_20px_55px_rgba(99,102,241,0.2)]"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <h3 className="text-lg font-semibold text-primary mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="text-center text-sm text-gray-500 pt-6 border-t border-indigo-100/50">
        © {new Date().getFullYear()} Engineering Admission Portal. All rights reserved.
      </footer>
    </div>
  );
}
