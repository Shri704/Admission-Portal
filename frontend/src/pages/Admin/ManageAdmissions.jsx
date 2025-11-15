import { useMemo, useState, useEffect, useRef } from "react";
import useAdmin from "../../hooks/useAdmin.js";
import useNotification from "../../hooks/useNotification.js";
import { useBranches } from "../../context/BranchesContext.jsx";
import { updateAdmissionStatus } from "../../services/admissionService.js";
import { getYearLabel } from "../../utils/yearUtils.js";
import { YEARS } from "../../utils/constants.js";

const STATUS_OPTIONS = ["pending", "approved", "rejected"];

export default function ManageAdmissions() {
  const { admissions, refreshAdmissions, loading } = useAdmin();
  const { showToast } = useNotification();
  const { branchesForSelect } = useBranches();
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const isInitialMount = useRef(true);

  // Calculate status counts from current admissions (already filtered by backend)
  const statusCounts = useMemo(() => {
    return {
      approved: admissions.filter((a) => a.status === "approved").length,
      pending: admissions.filter((a) => a.status === "pending").length,
      rejected: admissions.filter((a) => a.status === "rejected").length,
      total: admissions.length,
    };
  }, [admissions]);

  const computedAdmissions = useMemo(
    () =>
      admissions.map((admission) => {
        const student = admission.studentId ?? {};
        const baseYear =
          admission.year ?? student.year ?? null;

        return {
          ...admission,
          displayName: student.name || "Unknown Student",
          email: student.email || "—",
          branch: admission.branch || student.branch || "—",
          appliedYear: baseYear,
          yearLabel: baseYear ? getYearLabel(baseYear) : "—",
          programStartYear: student.programStartYear ?? null,
          expectedGraduationYear: student.expectedGraduationYear ?? null,
          status: admission.status || "pending", // Ensure status is always set
        };
      }),
    [admissions]
  );

  // Load admissions with filters when year or branch changes
  useEffect(() => {
    // Skip initial mount - admissions are already loaded by AdminContext bootstrap
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = {};
    if (selectedYear) params.year = selectedYear;
    if (selectedBranch) params.branch = selectedBranch;
    refreshAdmissions(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedBranch]); // refreshAdmissions is stable from context

  const handleStatusChange = async (admissionId, newStatus) => {
    if (!admissionId || !newStatus) {
      showToast("Invalid admission or status.", "error");
      return;
    }

    try {
      setUpdatingId(admissionId);
      const response = await updateAdmissionStatus(admissionId, { status: newStatus });
      
      // The API returns { success: true, message: "...", data: {...} }
      showToast(
        response?.message || `Admission ${newStatus} successfully.`,
        "success"
      );
      // Refresh the admissions list to get updated data
      await refreshAdmissions();
    } catch (error) {
      console.error("Error updating admission status:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to update admission status at this time.";
      showToast(message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================= Header ================= */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-indigo-100/50 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
            Manage Admissions
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review and update the status of student admission submissions.
          </p>
        </div>
        <button
          onClick={() => {
            const params = {};
            if (selectedYear) params.year = selectedYear;
            if (selectedBranch) params.branch = selectedBranch;
            refreshAdmissions(params);
          }}
          className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-[0.97]"
        >
          Refresh Applications
        </button>
      </header>

      {/* ================= Filters and Counts ================= */}
      <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              >
                <option value="">All Years</option>
                {YEARS.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              >
                <option value="">All Branches</option>
                {branchesForSelect.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Counts */}
          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg bg-green-50 px-4 py-2 border border-green-200">
              <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Approved
              </div>
              <div className="text-2xl font-bold text-green-700">{statusCounts.approved}</div>
            </div>
            <div className="rounded-lg bg-yellow-50 px-4 py-2 border border-yellow-200">
              <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                Pending
              </div>
              <div className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</div>
            </div>
            <div className="rounded-lg bg-red-50 px-4 py-2 border border-red-200">
              <div className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                Rejected
              </div>
              <div className="text-2xl font-bold text-red-700">{statusCounts.rejected}</div>
            </div>
            <div className="rounded-lg bg-indigo-50 px-4 py-2 border border-indigo-200">
              <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                Total
              </div>
              <div className="text-2xl font-bold text-indigo-700">{statusCounts.total}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Table Section ================= */}
      <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        {loading && admissions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">Loading admissions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3 whitespace-nowrap">Start Year</th>
                <th className="px-4 py-3 whitespace-nowrap">Graduation</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {computedAdmissions.map((admission) => (
                <tr
                  key={admission._id}
                  className="hover:bg-indigo-50/50 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">
                      {admission.displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {admission.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {admission.yearLabel || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {admission.branch || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {admission.programStartYear ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {admission.expectedGraduationYear ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={admission.status || "pending"}
                      onChange={(event) => {
                        const newStatus = event.target.value;
                        if (newStatus !== admission.status) {
                          handleStatusChange(admission._id, newStatus);
                        }
                      }}
                      disabled={updatingId === admission._id}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        admission.status === "approved"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : admission.status === "rejected"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-yellow-200 bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {updatingId === admission._id && (
                      <span className="ml-2 text-xs text-gray-500">Updating...</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(admission.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {computedAdmissions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No admission applications are pending review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </section>
    </div>
  );
}
