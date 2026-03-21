import { apiRequest } from "./api";

export async function sendMessage(message) {
  return await apiRequest("/chatbot/message", {
    method: "POST",
    body: JSON.stringify({ message })
  });
}
