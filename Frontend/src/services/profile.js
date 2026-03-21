import { apiRequest } from "./api";

export async function getProfile() {
  return await apiRequest("/profile", { method: "GET" });
}

export async function updateProfile(profileData) {
  return await apiRequest("/profile", {
    method: "PUT",
    body: JSON.stringify(profileData)
  });
}
