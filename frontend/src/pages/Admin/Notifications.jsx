import { useEffect, useState } from "react";
import useAdmin from "../../hooks/useAdmin.js";
import useNotification from "../../hooks/useNotification.js";
import { createNotification } from "../../services/notificationService.js";

export default function Notifications() {
  const { students } = useAdmin();
  const {
    notifications,
    fetchNotifications,
    showToast,
    loading: loadingNotifications,
  } = useNotification();
  const [form, setForm] = useState({
    recipientId: "",
    message: "",
    recipientRole: "Student",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.recipientId || !form.message) return;
    try {
      setSending(true);
      await createNotification(form);
      showToast("Notification sent successfully.", "success");
      setForm((prev) => ({ ...prev, message: "" }));
      fetchNotifications();
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to send notification.";
      showToast(message, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================= Header ================= */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-indigo-100/50 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Notify students about admission updates, fee reminders, and important announcements.
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-[0.97]"
        >
          Refresh
        </button>
      </header>

      {/* ================= Notification Form ================= */}
      <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Recipient</label>
            <select
              name="recipientId"
              value={form.recipientId}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-black px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} — {student.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white text-black px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              placeholder="Type your notification message..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition-all hover:shadow-[0_14px_40px_rgba(37,99,235,0.35)] disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </section>

      {/* ================= Notification List ================= */}
      <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:shadow-[0_10px_40px_rgba(37,99,235,0.12)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark">Recent Notifications</h2>
          <button
            onClick={fetchNotifications}
            className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {loadingNotifications ? (
            <p className="text-sm text-gray-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No notifications sent yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="rounded-xl border border-gray-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 px-4 py-3 hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] transition-all"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
