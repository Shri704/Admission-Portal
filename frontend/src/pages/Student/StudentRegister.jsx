import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { useBranches } from "../../context/BranchesContext.jsx";
import { ADMISSION_CATEGORIES, YEARS } from "../../utils/constants.js";
import logoMark from "../../assets/portal-logo.svg";

export default function StudentRegister() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { branchesForSelect } = useBranches();
  const currentYear = new Date().getFullYear();
  const startYearOptions = Array.from({ length: 8 }, (_, index) => currentYear - index);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    branch: "",
    category: "CET",
    programStartYear: String(currentYear),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register({
        ...form,
        year: Number(form.year),
        programStartYear: Number(form.programStartYear),
        category: form.category,
      });
      navigate("/student/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="min-h-[85vh] space-y-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-10 md:p-14 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all">
      {/* ===== HEADER ===== */}
      <header className="flex items-start gap-4 border-b border-indigo-100/50 pb-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft">
          <img src={logoMark} alt="Portal logo" className="h-10 w-10" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-dark drop-shadow-sm">
            Create Student Account
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600 leading-relaxed">
            Register with your academic details to access your personalized dashboard for 
            admissions, payments, and notifications.
          </p>
        </div>
      </header>

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 rounded-3xl bg-white/90 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-md md:grid-cols-2 hover:shadow-[0_32px_80px_rgba(37,99,235,0.2)] transition"
      >
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="form-label">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="college email address"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Min 8 characters"
            required
          />
        </div>

        {/* Academic Year */}
        <div>
          <label className="form-label">Current Academic Year</label>
          <div className="select-wrapper">
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select</option>
              {YEARS.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Program Start Year */}
        <div>
          <label className="form-label">Academic Start Year</label>
          <div className="select-wrapper">
            <select
              name="programStartYear"
              value={form.programStartYear}
              onChange={handleChange}
              className="form-control"
              required
            >
              {startYearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Branch */}
        <div>
          <label className="form-label">Branch</label>
          <div className="select-wrapper">
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select</option>
              {branchesForSelect.map((branch) => (
                <option key={branch.value} value={branch.value}>
                  {branch.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Admission Category */}
        <div>
          <label className="form-label">Admission Category</label>
          <div className="select-wrapper">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="form-control"
              required
            >
              {ADMISSION_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>
      </form>

      {/* ===== FOOTER LINK ===== */}
      <p className="text-center text-sm text-gray-500">
        Already registered?{" "}
        <Link
          to="/student/login"
          className="font-semibold text-primary hover:underline transition"
        >
          Login to your account
        </Link>
      </p>
    </div>
  );
}
