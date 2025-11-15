import api from "./api";

export async function getAllFees() {
  const { data } = await api.get("/fees");
  return data;
}

export async function getStudentFees(params) {
  const { data } = await api.get("/fees/student", { params });
  return data;
}

export async function getStudentFeesByType(type, params) {
  const { data } = await api.get(`/fees/student/${type}`, { params });
  return data;
}

export async function saveFeeStructure(payload) {
  const { data } = await api.post("/admin/fees", payload);
  return data;
}

