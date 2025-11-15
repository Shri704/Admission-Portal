import logoMark from "../../assets/portal-logo.svg";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/20 bg-white/80 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-sm text-gray-500 sm:flex-row sm:text-left">
        {/* ===== Left Section ===== */}
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-md">
            <img
              src={logoMark}
              alt="Portal logo"
              className="h-7 w-7 drop-shadow-sm"
            />
          </span>
          <p className="text-gray-600 font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-indigo-600">
              Engineering Admission Portal
            </span>
            . All rights reserved.
          </p>
        </div>

        {/* ===== Right Section ===== */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500">
          <a
            className="transition-all duration-200 hover:text-indigo-600 hover:underline"
            href="mailto:support@admissionportal.edu"
          >
            support@admissionportal.edu
          </a>
          <span className="hidden h-4 w-px bg-gray-300 sm:block" />
          <span className="text-gray-400 hover:text-gray-600 transition-colors">
            +91 98765 43210
          </span>
        </div>
      </div>
    </footer>
  );
}
