import ProfileCard from "../../components/common/student/ProfileCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import useStudent from "../../hooks/useStudent.js";

export default function Profile() {
  const { profile, saveProfile, loading } = useStudent();

  if (!profile) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-10 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition-all">
      {/* ========== Header ========== */}
      <header className="border-b border-indigo-100/50 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">
          Review and update your contact details, academic year, and USN. Ensure
          your information is accurate for admission and payment records.
        </p>
      </header>

      {/* ========== Profile Card Section ========== */}
      <section className="rounded-2xl bg-white/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        <ProfileCard profile={profile} onSave={saveProfile} loading={loading} />
      </section>
    </div>
  );
}
