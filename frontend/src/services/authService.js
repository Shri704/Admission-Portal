import api from "./api";

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  // API returns { success: true, message: "...", data: { user info with token } }
  // Extract the data object which contains user info and token
  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  // Fallback to the whole response if structure is different
  return response.data;
}

export async function register(payload) {
  const response = await api.post("/auth/register", payload);
  // API returns { success: true, message: "...", data: { user info with token } }
  // Extract the data object which contains user info and token
  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  // Fallback to the whole response if structure is different
  return response.data;
}

export async function fetchProfile() {
  const { data } = await api.get("/students/profile");
  return data;
}

export async function logout() {
  await Promise.resolve(); // placeholder for server logout if needed
  localStorage.removeItem("admission_portal_token");
  localStorage.removeItem("admission_portal_user");
}

