import api from "./api";

export async function getStudentProfile() {
  const { data } = await api.get("/students/profile");
  return data;
}

export async function updateStudentProfile(updates) {
  const { data } = await api.put("/students/profile", updates);
  return data;
}

export async function fetchStudents() {
  const { data } = await api.get("/admin/students");
  return data;
}

