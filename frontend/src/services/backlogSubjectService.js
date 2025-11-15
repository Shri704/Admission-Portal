// frontend/src/services/backlogSubjectService.js
import api from "./api";

export async function getBacklogSubjects(params) {
  const { data } = await api.get("/backlog-subjects/student", { params });
  return data;
}

export async function getBacklogFeeAmount() {
  const { data } = await api.get("/backlog-subjects/fee-amount");
  return data;
}

export async function createBacklogSubjects(subjects) {
  const { data } = await api.post("/backlog-subjects", { subjects });
  return data;
}

export async function updateBacklogSubject(id, updates) {
  const { data } = await api.put(`/backlog-subjects/${id}`, updates);
  return data;
}

export async function deleteBacklogSubject(id) {
  const { data } = await api.delete(`/backlog-subjects/${id}`);
  return data;
}

