import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import logoMark from "../../assets/portal-logo.svg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDashboard = () => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    else navigate("/student/dashboard");
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200/10 backdrop-blur-xl transition-all duration-500 ${
        scrolled
          ? "bg-white/85 shadow-[0_12px_36px_rgba(37,99,235,0.14)]"
          : "bg-white/65"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
        {/* ================== Logo ================== */}
        <Link
          to="/"
          className="group flex items-center gap-3 text-lg font-semibold text-slate-800"
        >
          <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-[0_6px_16px_rgba(79,70,229,0.35)] transition-transform duration-500 group-hover:scale-105">
            <img
              src={logoMark}
              alt="Portal Logo"
              className="h-10 w-10 drop-shadow-[0_4px_8px_rgba(59,130,246,0.35)] transition-transform duration-500 group-hover:scale-110"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold text-gray-900">
              Engineering
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600/80">
              Admission Portal
            </span>
          </span>
        </Link>

        {/* ================== Desktop Nav ================== */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ================== Desktop Buttons ================== */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleDashboard}
                className="btn btn-primary btn-sm"
              >
                {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/student/login"
                className="btn btn-outline btn-sm"
              >
                Student Login
              </Link>
              <Link
                to="/admin/login"
                className="btn btn-primary btn-sm"
              >
                Admin Login
              </Link>
            </>
          )}
        </div>

        {/* ================== Mobile Menu Button ================== */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-1 ring-indigo-200 transition-transform duration-300 hover:scale-105 md:hidden"
        >
          <span
            className={`block h-0.5 w-6 rounded-full bg-indigo-600 transition-all duration-300 ${
              open ? "translate-y-1.5 rotate-45" : ""
            }`}
          ></span>
          <span
            className={`mt-1 block h-0.5 w-6 rounded-full bg-indigo-600 transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`mt-1 block h-0.5 w-6 rounded-full bg-indigo-600 transition-all duration-300 ${
              open ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* ================== Mobile Menu ================== */}
      {open && (
        <div className="border-t border-indigo-100 bg-white/95 shadow-[0_10px_40px_rgba(37,99,235,0.18)] backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 ring-1 ring-indigo-200"
                      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className="btn btn-primary btn-sm w-full"
                  >
                    {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-sm w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/student/login"
                    onClick={() => setOpen(false)}
                    className="btn btn-outline btn-sm w-full text-center"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/admin/login"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary btn-sm w-full text-center"
                  >
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
