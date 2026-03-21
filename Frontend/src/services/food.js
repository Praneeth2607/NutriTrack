import { apiRequest } from "./api";

export async function searchFoods(query) {
  if (!query) return [];
  return await apiRequest(`/food/search?q=${encodeURIComponent(query)}`);
}
