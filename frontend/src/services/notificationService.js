import api from "./api";

export async function createNotification(payload) {
  const { data } = await api.post("/notifications", payload);
  return data;
}

export async function fetchNotifications() {
  const { data } = await api.get("/notifications");
  return data;
}

