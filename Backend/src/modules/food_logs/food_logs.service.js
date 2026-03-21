import pool from "../../config/db.js";

// Add a food log entry
export async function addFoodLog(userId, logData) {
  const { food_id, meal_type, quantity_g, consumed_date } = logData;
  const targetDate = consumed_date || new Date().toISOString().split('T')[0];

  const query = `
    INSERT INTO food_logs (user_id, food_id, meal_type, quantity_g, consumed_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [userId, food_id, meal_type, quantity_g, targetDate];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Get all food logs for a user on a specific date
export async function getDailyLogs(userId, dateISO) {
  const query = `
    SELECT fl.id as log_id, fl.meal_type, fl.quantity_g, fl.consumed_date,
           f.id as food_id, f.name as food_name,
           (fn.calories_kcal * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as calories,
           (fn.protein_g * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as protein,
           (fn.carbs_g * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as carbs,
           (fn.fat_g * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as fat,
           (fn.fibre_g * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as fibre,
           (fn.free_sugar_g * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as sugar,
           (fn.sodium_mg * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as sodium,
           (fn.calcium_mg * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as calcium,
           (fn.iron_mg * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as iron,
           (fn.vitamin_c_mg * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as vitamin_c,
           (fn.folate_ug * (fl.quantity_g / fn.base_quantity_g))::numeric(10,2) as folate
    FROM food_logs fl
    JOIN foods f ON fl.food_id = f.id
    JOIN food_nutrients fn ON f.id = fn.food_id
    WHERE fl.user_id = $1 AND fl.consumed_date = $2
    ORDER BY fl.created_at DESC;
  `;
  const result = await pool.query(query, [userId, dateISO]);
  return result.rows;
}

// Get daily nutritional summary
export async function getDailySummary(userId, dateISO) {
  const query = `
    SELECT 
      COALESCE(SUM(fn.calories_kcal * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_calories,
      COALESCE(SUM(fn.protein_g * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_protein,
      COALESCE(SUM(fn.carbs_g * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_carbs,
      COALESCE(SUM(fn.fat_g * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_fat,
      COALESCE(SUM(fn.fibre_g * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_fibre,
      COALESCE(SUM(fn.free_sugar_g * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_sugar,
      COALESCE(SUM(fn.sodium_mg * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_sodium,
      COALESCE(SUM(fn.calcium_mg * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_calcium,
      COALESCE(SUM(fn.iron_mg * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_iron,
      COALESCE(SUM(fn.vitamin_c_mg * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_vitamin_c,
      COALESCE(SUM(fn.folate_ug * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_folate
    FROM food_logs fl
    JOIN food_nutrients fn ON fl.food_id = fn.food_id
    WHERE fl.user_id = $1 AND fl.consumed_date = $2;
  `;
  const result = await pool.query(query, [userId, dateISO]);
  return result.rows[0];
}

// Delete a food log
export async function deleteFoodLog(userId, logId) {
  const query = `
    DELETE FROM food_logs 
    WHERE id = $1 AND user_id = $2
    RETURNING id;
  `;
  const result = await pool.query(query, [logId, userId]);
  return result.rows.length > 0;
}

// Get weekly summary (last 7 days mapping)
export async function getWeeklySummary(userId, endDateISO) {
  const query = `
    SELECT 
      TO_CHAR(fl.consumed_date, 'YYYY-MM-DD') as date,
      COALESCE(SUM(fn.calories_kcal * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_calories,
      COALESCE(SUM(fn.protein_g * (fl.quantity_g / fn.base_quantity_g)), 0)::numeric(10,2) as total_protein
    FROM food_logs fl
    JOIN food_nutrients fn ON fl.food_id = fn.food_id
    WHERE fl.user_id = $1 
      AND fl.consumed_date > $2::date - interval '7 days'
      AND fl.consumed_date <= $2::date
    GROUP BY fl.consumed_date
    ORDER BY fl.consumed_date ASC;
  `;
  const result = await pool.query(query, [userId, endDateISO]);
  return result.rows;
}
