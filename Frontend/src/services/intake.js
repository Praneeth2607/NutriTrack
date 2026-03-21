import { apiRequest } from "./api";

export async function getDailyLogs(date) {
  const query = date ? `?date=${date}` : "";
  return await apiRequest(`/food-logs${query}`);
}

export async function getWeeklyLogs(date) {
  const query = date ? `?date=${date}` : "";
  return await apiRequest(`/food-logs/weekly${query}`);
}

export async function addFoodLog(logData) {
  return await apiRequest("/food-logs", {
    method: "POST",
    body: JSON.stringify(logData)
  });
}

export async function deleteFoodLog(logId) {
  return await apiRequest(`/food-logs/${logId}`, {
    method: "DELETE"
  });
}
