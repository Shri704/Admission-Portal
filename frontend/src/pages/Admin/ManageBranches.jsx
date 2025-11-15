import { useState, useEffect } from "react";
import useNotification from "../../hooks/useNotification.js";
import { useBranches } from "../../context/BranchesContext.jsx";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../services/branchService.js";

export default function ManageBranches() {
  const { showToast } = useNotification();
  const { branches, loading, refreshBranches } = useBranches();
  const [localLoading, setLocalLoading] = useState(false);
  const [form, setForm] = useState({ code: "", name: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.name) {
      showToast("Branch code and name are required", "error");
      return;
    }

    try {
      setLocalLoading(true);
      if (editingId) {
        await updateBranch(editingId, form);
        showToast("Branch updated successfully", "success");
      } else {
        await createBranch(form);
        showToast("Branch added successfully", "success");
      }
      setForm({ code: "", name: "" });
      setEditingId(null);
      setShowForm(false);
      await refreshBranches(); // Refresh branches context
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to save branch";
      showToast(message, "error");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setForm({ code: branch.code, name: branch.name });
    setEditingId(branch._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) {
      return;
    }

    try {
      setLocalLoading(true);
      await deleteBranch(id);
      showToast("Branch deleted successfully", "success");
      await refreshBranches(); // Refresh branches context
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to delete branch";
      showToast(message, "error");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ code: "", name: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
      {/* ================= Header ================= */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-indigo-100/50 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-dark drop-shadow-sm">
            Manage Branches
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Add, edit, or remove branches. Changes will be reflected across the entire system.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#2563eb] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1e40af] transition-colors shadow-[0_10px_30px_rgba(37,99,235,0.22)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.35)] hover:scale-105"
        >
          {showForm ? "Cancel" : "+ Add Branch"}
        </button>
      </header>

      {/* ================= Add/Edit Form ================= */}
      {showForm && (
        <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Branch" : "Add New Branch"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Branch Code
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g., CSE, ECE, MECH"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                required
                disabled={!!editingId}
              />
              <p className="mt-1 text-xs text-gray-500">
                {editingId ? "Code cannot be changed" : "Unique code (e.g., CSE, ECE)"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Branch Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Computer Science & Engineering"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                required
              />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={localLoading}
                className="bg-[#2563eb] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {localLoading ? "Saving..." : editingId ? "Update Branch" : "Add Branch"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= Branches List ================= */}
      <section className="rounded-2xl bg-white/90 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Branches</h2>
        {(loading || localLoading) && branches.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">Loading branches...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {branches.map((branch) => (
                  <tr
                    key={branch._id}
                    className="hover:bg-indigo-50/50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {branch.code}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{branch.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          branch.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {branch.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(branch)}
                          className="text-primary hover:text-primary/80 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(branch._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {branches.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No branches found. Add your first branch to get started.
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

