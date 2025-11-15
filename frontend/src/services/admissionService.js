import api from "./api";

export async function applyAdmission(formData) {
  const { data } = await api.post("/admissions/apply", formData);
  return data;
}

export async function getAdmissionHistory() {
  const { data } = await api.get("/admissions/history");
  return data;
}

export async function getAdminAdmissions(params = {}) {
  const { data } = await api.get("/admin/admissions", { params });
  return data;
}

export async function updateAdmissionStatus(id, payload) {
  const { data } = await api.put(`/admin/admissions/${id}`, payload);
  return data;
}

