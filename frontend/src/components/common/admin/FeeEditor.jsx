import { useState } from "react";
import { useBranches } from "../../../context/BranchesContext.jsx";
import { ADMISSION_CATEGORIES, YEARS } from "../../../utils/constants.js";
import { formatINR } from "../../../utils/formatCurrency.js";

const FEE_TYPES = ["Academic", "Exam", "Backlog", "Other"];

export default function FeeEditor({ fees = [], onSave, loading }) {
  const { branchesForSelect } = useBranches();
  const [form, setForm] = useState({
    year: "",
    branch: "",
    type: "Academic",
    amount: "",
    description: "",
    category: "CET",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.year || !form.branch || !form.amount) {
      return;
    }
    onSave?.({
      year: Number(form.year),
      branch: form.branch,
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
    });
    // Reset form after successful save
    setForm({
      year: "",
      branch: "",
      type: form.type, // Keep the same type for convenience
      amount: "",
      description: "",
      category: form.category, // Keep the same category
    });
  };

  return (
    <section className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-[0_8px_25px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.08)]">
      <div className="flex flex-col gap-8">
        {/* ============== Header ============== */}
        <header className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            Fee Structure
          </h3>
          <p className="text-sm text-gray-500">
            Create or update fee components for each academic year and branch.
          </p>
        </header>

        {/* ============== Form ============== */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
        >
          <div>
            <label className="form-label">Year</label>
            <div className="select-wrapper">
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="form-control"
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

          <div>
            <label className="form-label">Branch</label>
            <div className="select-wrapper">
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="form-control"
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
          <div>
            <label className="form-label">Category</label>
            <div className="select-wrapper">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-control"
              >
                {ADMISSION_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Fee Type</label>
            <div className="select-wrapper">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="form-control"
              >
                {FEE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount in INR"
              min={0}
              className="form-control"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-2">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details"
              className="form-control"
            />
          </div>

          <div className="flex items-end justify-end sm:col-span-2 md:col-span-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-sm"
            >
              {loading ? "Saving..." : "Save Fee"}
            </button>
          </div>
        </form>

        {/* ============== Table ============== */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {fees.map((fee) => (
                <tr
                  key={fee._id}
                  className="transition-colors hover:bg-indigo-50/40"
                >
                  <td className="px-4 py-3 text-gray-700">{fee.year}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {
                      branchesForSelect.find((branch) => branch.value === fee.branch)
                        ?.label ?? fee.branch ?? "Not set"
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {
                      ADMISSION_CATEGORIES.find((category) => category.value === fee.category)
                        ?.label ?? fee.category ?? "Not set"
                    }
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {fee.type}
                  </td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">
                    {formatINR(fee.amount)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {fee.description || "-"}
                  </td>
                </tr>
              ))}

              {fees.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No fee structures defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
