import { useState } from "react";
import useStudent from "../../hooks/useStudent.js";
import { useBranches } from "../../context/BranchesContext.jsx";
import { YEARS } from "../../utils/constants.js";

export default function AdmissionForm() {
  const { submitAdmission, admissions, loading, documents } = useStudent();
  const { branchesForSelect } = useBranches();
  const [form, setForm] = useState({
    year: "",
    branch: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.year || !form.branch) return;
    await submitAdmission({
      year: Number(form.year),
      branch: form.branch,
      documents: documents.map((doc) => doc._id),
    });
    setForm({ year: "", branch: "" });
  };

  return (
    <div className="space-y-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================= Header ================= */}
      <header className="border-b border-indigo-100/50 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
          Admission Form
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Select the academic year and branch you are applying for. Admissions
          will be reviewed by the administration team.
        </p>
      </header>

      {/* ================= Form ================= */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 rounded-2xl bg-white/90 p-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)] md:grid-cols-2"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">Academic Year</label>
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white text-black px-3 py-2 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            required
          >
            <option value="">Select Year</option>
            {YEARS.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Branch</label>
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white text-black px-3 py-2 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            required
          >
            <option value="">Select Branch</option>
            {branchesForSelect.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition-all hover:shadow-[0_14px_40px_rgba(37,99,235,0.35)] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>

      {/* ================= Admission History ================= */}
      <section className="rounded-2xl bg-white/90 p-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        <h2 className="text-xl font-bold text-dark">Admission History</h2>
        <p className="text-sm text-gray-600">
          Review the status of your past admission submissions.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {admissions.map((admission) => (
                <tr
                  key={admission._id}
                  className="hover:bg-indigo-50/30 transition-all"
                >
                  <td className="px-4 py-3 text-gray-700 font-medium">{admission.year}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{admission.branch}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        admission.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : admission.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {admission.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(admission.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {admissions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-gray-500 bg-gray-50 rounded-xl"
                  >
                    No admission applications submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
