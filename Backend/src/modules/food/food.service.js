import pool from "../../config/db.js";

export async function searchFoods(query) {
  const sql = `
    SELECT
      f.id,
      f.name,
      n.calories_kcal,
      n.protein_g,
      n.carbs_g,
      n.fat_g
    FROM foods f
    JOIN food_nutrients n ON f.id = n.food_id
    WHERE f.name ILIKE $1
    LIMIT 20;
  `;

  const result = await pool.query(sql, [`%${query}%`]);
  return result.rows;
}
