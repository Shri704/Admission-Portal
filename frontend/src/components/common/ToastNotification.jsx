import useNotification from "../../hooks/useNotification.js";

const toastColors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-indigo-50 border-indigo-200 text-indigo-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

export default function ToastNotification() {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 sm:right-8 sm:top-8">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`group relative w-80 animate-slide-in border px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.15)] ${
            toastColors[toast.type] || toastColors.info
          }`}
        >
          {/* Glow accent on left edge */}
          <div
            className={`absolute left-0 top-0 h-full w-1.5 rounded-l-xl ${
              toast.type === "success"
                ? "bg-green-400"
                : toast.type === "error"
                ? "bg-red-400"
                : toast.type === "warning"
                ? "bg-yellow-400"
                : "bg-indigo-400"
            }`}
          ></div>

          <div className="flex items-start justify-between gap-3 pl-2">
            <p className="text-sm font-medium leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 transition-colors hover:text-gray-700"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>

          {/* Progress bar indicator */}
          <div className="absolute bottom-0 left-0 h-[3px] w-full overflow-hidden rounded-b-xl">
            <div
              className={`h-full animate-toast-progress ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : toast.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-indigo-500"
              }`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
