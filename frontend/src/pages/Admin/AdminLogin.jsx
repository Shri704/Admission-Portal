import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import useNotification from "../../hooks/useNotification.js";
import logoMark from "../../assets/portal-logo.svg";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useNotification();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await login(form);
      if (data && data.role !== "admin") {
        showToast("Access denied. Admin credentials required.", "error");
        return;
      }
      if (data && data.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Admin login failed", error);
      // Error message is already shown by AuthContext, but we can add additional handling here if needed
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      if (!error.response?.data?.message) {
        showToast(errorMessage, "error");
      }
    }
  };

  return (
    <div className="grid min-h-[80vh] items-center gap-10 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 p-6 shadow-[0_10px_40px_rgba(37,99,235,0.08)] lg:grid-cols-[1.1fr_1fr] sm:p-10">
      {/* ================== LEFT SECTION ================== */}
      <section className="rounded-2xl bg-white/90 p-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-500 shadow-[0_8px_20px_rgba(37,99,235,0.25)]">
            <img src={logoMark} alt="Portal logo" className="h-10 w-10 drop-shadow-md" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-dark tracking-tight">
              Administrator Login
            </h1>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Manage admissions, student records, fees, and system notifications with secure admin
              privileges.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-5">
          <p className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-yellow-800 font-medium shadow-sm">
            ⚠️ Audit logging enabled for all admin actions.
          </p>
          <p className="leading-relaxed">
            Use credentials provided by your institution's super-admin. Enable MFA in your security
            settings for added protection.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-800 text-xs mt-2">
              💡 Default credentials: admin@admp.com / Adminp@1234 (if not changed)
            </p>
          )}
        </div>
      </section>

      {/* ================== RIGHT SECTION (FORM) ================== */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/95 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-lg space-y-6"
      >
        <div className="space-y-5">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="admin@college.edu"
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter admin password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full mt-4"
        >
          {loading ? "Signing in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}
