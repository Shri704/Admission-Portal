import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50 to-blue-50 text-center">
      {/* ======= Background Glow Effects ======= */}
      <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-indigo-300/30 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-300/30 blur-[120px]" />

      {/* ======= Main Content ======= */}
      <div className="relative z-10 mx-auto max-w-2xl p-8 animate-fade-in-up">
        <div className="mx-auto mb-6 w-fit rounded-full bg-indigo-100 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 shadow-inner">
          404 — Page Not Found
        </div>

        <h1 className="text-4xl font-extrabold text-dark drop-shadow-sm sm:text-5xl">
          We can’t find the page you’re looking for.
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-600">
          The page may have been moved, deleted, or you may have mistyped the
          address. You can return to your dashboard or head back to the homepage.
        </p>

        {/* ======= Button Group ======= */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_16px_45px_rgba(37,99,235,0.35)]"
          >
            Back to Home
          </Link>
          <Link
            to="/student/dashboard"
            className="rounded-full border border-indigo-500 px-8 py-3 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:scale-[1.05] hover:bg-indigo-50"
          >
            Student Dashboard
          </Link>
        </div>
      </div>

      {/* ======= Floating 404 Graphic ======= */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <h1 className="text-[18rem] font-extrabold text-indigo-700/60 select-none leading-none animate-pulse-slow">
          404
        </h1>
      </div>
    </div>
  );
}