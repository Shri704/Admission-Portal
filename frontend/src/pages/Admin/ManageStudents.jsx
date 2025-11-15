import StudentList from "../../components/common/admin/StudentList.jsx";
import useAdmin from "../../hooks/useAdmin.js";

export default function ManageStudents() {
  const { students, refreshStudents } = useAdmin();

  return (
    <div className="space-y-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================= Header ================= */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-indigo-100/50 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
            Manage Students
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review registered students, admission status, and USN allocations.
          </p>
        </div>
        <button
          onClick={refreshStudents}
          className="btn btn-outline btn-sm"
        >
          Refresh List
        </button>
      </header>

      {/* ================= Student Table ================= */}
      <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        <StudentList students={students} />
      </section>
    </div>
  );
}
