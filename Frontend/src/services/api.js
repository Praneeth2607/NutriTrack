import { getToken } from "./authStorage";

const API_BASE_URL = "http://localhost:3000"; 
// change later via env

export async function apiRequest(path, options = {}) {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {})
    },
    ...options
    })

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
