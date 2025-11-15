import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import logoMark from "../../assets/portal-logo.svg";

export default function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form
    if (!form.email || !form.password) {
      return;
    }

    try {
      const data = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      
      if (data?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
      
      const redirectTo = location.state?.from?.pathname || "/student/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      // Error is already handled by AuthContext and shown via toast
      console.error("Login failed", error);
    }
  };

  return (
    <div className="grid min-h-[85vh] items-center gap-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-10 md:p-14 lg:grid-cols-[1.05fr_1fr] shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all">
      {/* ===== LEFT INFO PANEL ===== */}
      <section className="rounded-3xl bg-white/90 p-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md space-y-6 hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)] transition">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft">
            <img src={logoMark} alt="Portal logo" className="h-10 w-10" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-dark drop-shadow-sm">
              Student Login
            </h1>
            <p className="mt-1 text-sm text-gray-600 max-w-md">
              Access your personalized dashboard to manage admissions, documents, and payments.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <p className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 shadow-inner">
            ✅ Secure access with email and password
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Use your registered email credentials. If you face any issues signing in, please
            contact your institution's admission coordinator for assistance.
          </p>
        </div>
      </section>

      {/* ===== LOGIN FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white/95 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-md space-y-6 transition hover:shadow-[0_32px_80px_rgba(37,99,235,0.2)]"
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
              placeholder="student@example.com"
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
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500">
          New student?{" "}
          <Link
            to="/student/register"
            className="font-semibold text-primary hover:underline transition"
          >
            Create your account
          </Link>
        </p>
      </form>
    </div>
  );
}
