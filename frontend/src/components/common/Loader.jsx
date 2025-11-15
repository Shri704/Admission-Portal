export default function Loader({ fullScreen = false, label = "Loading..." }) {
  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-white/80 backdrop-blur-md"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          <span className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.2)]"></span>
          <span className="absolute h-5 w-5 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
        </div>

        {/* Label */}
        <p className="text-sm font-semibold text-gray-600 animate-pulse">
          {label}
        </p>
      </div>
    </div>
  );
}
