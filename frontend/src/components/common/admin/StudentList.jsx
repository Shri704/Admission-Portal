import { useMemo, useState } from "react";
import { ADMISSION_CATEGORIES } from "../../../utils/constants.js";
import { getYearLabel } from "../../../utils/yearUtils.js";

export default function StudentList({ students = [] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return students;
    const lower = query.toLowerCase();
    return students.filter((student) => {
      const category = student.category?.toLowerCase?.() || "";
      return (
        student.name?.toLowerCase().includes(lower) ||
        student.email?.toLowerCase().includes(lower) ||
        student.branch?.toLowerCase().includes(lower) ||
        student.usn?.toLowerCase().includes(lower) ||
        category.includes(lower)
      );
    });
  }, [students, query]);

  return (
    <section className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-[0_8px_25px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.08)]">
      <div className="flex flex-col gap-6">
        {/* ===== Header ===== */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Student Directory
            </h3>
            <p className="text-sm text-gray-500">
              Overview of all registered engineering students.
            </p>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, branch, category, or USN"
            className="form-control md:w-72"
          />
        </header>

        {/* ===== Table ===== */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">USN</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 bg-white">
              {filtered.map((student) => (
                <tr
                  key={student._id}
                  className="transition-colors hover:bg-indigo-50/40"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {student.email}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {student.branch}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {
                      ADMISSION_CATEGORIES.find((item) => item.value === student.category)
                        ?.label ?? student.category ?? "-"
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {getYearLabel(student.year)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {student.usn || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        student.admissionStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : student.admissionStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.admissionStatus}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No students match the current search criteria.
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
