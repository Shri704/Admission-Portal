import { ADMISSION_CATEGORIES } from "../../../utils/constants.js";
import { formatINR } from "../../../utils/formatCurrency.js";

export default function FeeSummaryCard({
  fees = [],
  total = 0,
  paid = 0,
  pending = 0,
  periodLabel,
  onPay,
  loading,
  paymentMode,
  onPaymentModeChange,
  payableAmount,
}) {
  const categoryLabel = fees.length
    ? ADMISSION_CATEGORIES.find((item) => item.value === fees[0]?.category)?.label ??
      fees[0]?.category
    : null;

  const halfAmount = Math.max(0, Math.ceil(pending / 2));
  const effectivePayable = payableAmount && payableAmount > 0 ? payableAmount : pending;
  const canAdjustPayment = typeof onPaymentModeChange === "function" && pending > 0;
  const currentMode = paymentMode || "full";

  return (
    <section className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-[0_8px_25px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.08)]">
      <div className="flex flex-col gap-6">
        {/* ===== Header ===== */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Fee Summary {periodLabel ? `– ${periodLabel}` : ""}
            </h3>
            <p className="text-sm text-gray-500">
              Review the fee components applicable for your current academic term.
            </p>
            {categoryLabel && (
              <p className="mt-1 text-xs font-semibold text-indigo-600/80">
                Category: {categoryLabel}
              </p>
            )}
          </div>

          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
            Total Due: {formatINR(total)}
          </span>
        </header>

        <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
          <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Payable
            </p>
            <p className="text-lg font-semibold text-indigo-700">{formatINR(total)}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Paid Till Date
            </p>
            <p className="text-lg font-semibold text-emerald-600">{formatINR(paid)}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pending Amount
            </p>
            <p className="text-lg font-semibold text-amber-600">{formatINR(pending)}</p>
          </div>
        </div>

        {canAdjustPayment && (
          <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100/60 bg-indigo-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-900">Choose payment amount</p>
              <p className="text-xs text-indigo-600/80">
                Pay half now to keep studying, or settle the full pending amount.
              </p>
            </div>
            <div className="inline-flex rounded-full bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => onPaymentModeChange("half")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  currentMode === "half"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-indigo-600 hover:bg-indigo-100"
                }`}
                disabled={pending <= 0}
              >
                Half ({formatINR(halfAmount)})
              </button>
              <button
                type="button"
                onClick={() => onPaymentModeChange("full")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  currentMode === "full"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                Full ({formatINR(pending)})
              </button>
            </div>
          </div>
        )}

        {/* ===== Fee List ===== */}
        <div className="space-y-3">
          {fees.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
              No fee details available for the selected criteria.
            </p>
          ) : (
            fees.map((fee) => (
              <div
                key={`${fee.type}-${fee._id || fee.amount}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {fee.type}
                  </p>
                  {fee.description && (
                    <p className="text-xs text-gray-500">
                      {fee.description}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-indigo-600">
                  {formatINR(fee.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* ===== Action ===== */}
        <div className="flex justify-end">
          <button
            onClick={onPay}
            disabled={
              loading ||
              fees.length === 0 ||
              pending <= 0 ||
              !effectivePayable ||
              effectivePayable <= 0
            }
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : pending > 0
                ? `Pay ${formatINR(effectivePayable)}`
                : "Settled"}
          </button>
        </div>
      </div>
    </section>
  );
}
