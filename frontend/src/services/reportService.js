import api from "./api";

export async function getPaymentSummary() {
  const { data } = await api.get("/reports/payments");
  return data;
}

export async function getStudentStats() {
  const { data } = await api.get("/reports/students");
  return data;
}

