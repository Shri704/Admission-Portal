// frontend/src/services/branchService.js
import api from "./api";

export async function getBranches() {
  const { data } = await api.get("/branches");
  return data;
}

export async function getAllBranches() {
  const { data } = await api.get("/admin/branches");
  return data;
}

export async function createBranch(payload) {
  const { data } = await api.post("/admin/branches", payload);
  return data;
}

export async function updateBranch(id, payload) {
  const { data } = await api.put(`/admin/branches/${id}`, payload);
  return data;
}

export async function deleteBranch(id) {
  const { data } = await api.delete(`/admin/branches/${id}`);
  return data;
}

