import * as foodService from "./food.service.js";

export async function search(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const foods = await foodService.searchFoods(q);
    res.json(foods);
  } catch (err) {
    next(err);
  }
}
