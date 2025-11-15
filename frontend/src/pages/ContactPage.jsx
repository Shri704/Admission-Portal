import { useState } from "react";
import useNotification from "../hooks/useNotification.js";

export default function ContactPage() {
  const { showToast } = useNotification();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    showToast("Thanks for reaching out! We'll contact you shortly.", "success");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-[85vh] space-y-16 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-10 md:p-14 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all">
      {/* ===== HEADER ===== */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-dark drop-shadow-sm tracking-tight">
          Contact Support
        </h1>
        <p className="mx-auto max-w-2xl text-base text-gray-600 leading-relaxed">
          Need help configuring the portal, handling admissions, or resolving a payment?
          Our support engineers are ready to assist within business hours.
        </p>
      </header>

      {/* ===== CONTACT SECTION ===== */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* === LEFT SECTION === */}
        <section className="rounded-3xl bg-white/90 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-md transition hover:shadow-[0_32px_80px_rgba(37,99,235,0.2)]">
          <h2 className="text-2xl font-semibold text-dark mb-3">Reach Us Directly</h2>
          <p className="text-sm leading-relaxed text-gray-600 mb-6">
            Drop us a line for onboarding guidance, walkthroughs, or priority assistance.
            We aim to respond within one business day.
          </p>

          <div className="space-y-5 text-sm text-gray-700">
            <div className="rounded-xl bg-gray-50/70 border border-gray-200 px-5 py-3 shadow-inner hover:bg-gray-100/80 transition">
              <span className="font-semibold text-primary block">📧 Email</span>
              support@admissionportal.edu
            </div>
            <div className="rounded-xl bg-gray-50/70 border border-gray-200 px-5 py-3 shadow-inner hover:bg-gray-100/80 transition">
              <span className="font-semibold text-primary block">📞 Phone</span>
              +91 98765 43210
            </div>
            <div className="rounded-xl bg-gray-50/70 border border-gray-200 px-5 py-3 shadow-inner hover:bg-gray-100/80 transition">
              <span className="font-semibold text-primary block">🕓 Office Hours</span>
              Monday – Friday, 9:00 AM – 6:00 PM IST
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/10 p-5 text-sm text-gray-600">
            💡 <span className="font-semibold">Pro Tip:</span> For urgent matters, include your
            registered email ID and admission reference number in your message.
          </div>
        </section>

        {/* === RIGHT SECTION === */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/90 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-md space-y-6 transition hover:shadow-[0_32px_80px_rgba(37,99,235,0.2)]"
        >
          <h2 className="text-2xl font-semibold text-dark">Send a Message</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-black px-4 py-2.5 text-sm shadow-inner focus:border-primary focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-black px-4 py-2.5 text-sm shadow-inner focus:border-primary focus:outline-none"
                placeholder="Institution email address"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-black px-4 py-2.5 text-sm shadow-inner focus:border-primary focus:outline-none"
                placeholder="How can we help you?"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_46px_rgba(37,99,235,0.25)] transition hover:scale-[1.02] hover:shadow-[0_20px_55px_rgba(99,102,241,0.3)]"
          >
            Submit Query
          </button>
        </form>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="pt-8 border-t border-indigo-100/50 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Engineering Admission Portal. All rights reserved.
      </footer>
    </div>
  );
}
