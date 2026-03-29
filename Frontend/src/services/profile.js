import { apiRequest } from "./api";

export async function getProfile() {
  try {
    return await apiRequest("/profile", { method: "GET" });
  } catch (err) {
    if (err.status === 404) return {};
    throw err;
  }
}

export async function updateProfile(profileData) {
  return await apiRequest("/profile", {
    method: "PUT",
    body: JSON.stringify(profileData)
  });
}
