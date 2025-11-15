import { useEffect, useState } from "react";
import defaultAvatar from "../../../assets/defaultProfile.jpg";
import {
  ADMISSION_CATEGORIES,
  BRANCHES,
  YEARS,
} from "../../../utils/constants.js";

export default function ProfileCard({ profile, onSave, loading }) {
  const [form, setForm] = useState({
    phone: "",
    usn: "",
    branch: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        phone: profile.phone || "",
        usn: profile.usn || "",
        branch: profile.branch || "",
      });
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave?.(form);
  };

  if (!profile) return null;

  return (
    <section className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-[0_8px_25px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.08)]">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* ===== Left: Profile Info ===== */}
        <div className="flex flex-col items-center gap-3 md:w-1/3">
          <img
            src={profile.photoUrl || defaultAvatar}
            alt={profile.name}
            className="h-32 w-32 rounded-full object-cover shadow-md ring-4 ring-indigo-100 hover:scale-105 transition-transform duration-300"
          />
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {profile.name}
            </h3>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                profile.admissionStatus === "approved"
                  ? "bg-green-100 text-green-700"
                  : profile.admissionStatus === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {profile.admissionStatus?.toUpperCase()}
            </span>

            {profile.category && (
              <p className="mt-2 text-xs font-semibold text-indigo-600/80">
                Category:{" "}
                {
                  ADMISSION_CATEGORIES.find(
                    (item) => item.value === profile.category
                  )?.label ?? profile.category
                }
              </p>
            )}
          </div>
        </div>

        {/* ===== Right: Editable Form ===== */}
        <form
          onSubmit={handleSubmit}
          className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Phone */}
          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="form-control"
            />
          </div>

          {/* USN */}
          <div>
            <label className="form-label">USN</label>
            <input
              type="text"
              name="usn"
              value={form.usn}
              onChange={handleChange}
              placeholder="University seat number"
              className="form-control uppercase"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="form-label">Branch</label>
            <div className="select-wrapper">
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Branch</option>
                {BRANCHES.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Timeline */}
          <div className="md:col-span-2 grid gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-900 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-xs uppercase text-indigo-600 tracking-wide">
                Current Academic Year
              </p>
              <p className="mt-1 text-base font-semibold">
                {YEARS.find((item) => String(item.value) === String(profile.year))?.label ??
                  `Year ${profile.year ?? "-"}`}
              </p>
            </div>
            <div>
              <p className="font-semibold text-xs uppercase text-indigo-600 tracking-wide">
                Program Start
              </p>
              <p className="mt-1 text-base font-semibold">
                {profile.programStartYear ?? "Not set"}
              </p>
            </div>
            <div>
              <p className="font-semibold text-xs uppercase text-indigo-600 tracking-wide">
                Expected Graduation
              </p>
              <p className="mt-1 text-base font-semibold">
                {profile.expectedGraduationYear ?? "Not set"}
              </p>
            </div>
            <div className="sm:col-span-3">
              <p className="font-semibold text-xs uppercase text-indigo-600 tracking-wide">
                Admission Status
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-white/80 px-4 py-2">
                <span className="font-semibold capitalize text-indigo-900">
                  {profile.admissionStatus}
                </span>
                <span className="text-xs text-indigo-600">
                  Account valid until{" "}
                  {profile.accountExpiresAt
                    ? new Date(profile.accountExpiresAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
