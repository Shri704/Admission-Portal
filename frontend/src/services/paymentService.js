import api from "./api";

export async function createPaymentOrder(payload) {
  const { data } = await api.post("/payments/create-order", payload);
  return data;
}

export async function verifyPayment(payload) {
  const { data } = await api.post("/payments/verify", payload);
  return data;
}

export async function getPaymentHistory() {
  const { data } = await api.get("/payments/history");
  return data;
}

export async function getAllPayments(params = {}) {
  const { data } = await api.get("/admin/payments", { params });
  return data;
}

