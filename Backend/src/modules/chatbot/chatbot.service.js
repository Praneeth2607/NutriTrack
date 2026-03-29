import pool from "../../config/db.js";

async function queryFoods(orderByColumn, direction, limit, prefixMessage) {
  const query = `
    SELECT f.name, fn.calories_kcal, fn.protein_g, fn.carbs_g, fn.fat_g
    FROM foods f
    JOIN food_nutrients fn ON f.id = fn.food_id
    ORDER BY fn.${orderByColumn} ${direction}
    LIMIT $1;
  `;
  const result = await pool.query(query, [limit]);
  
  const foodsList = result.rows.map(row => 
    `- **${row.name}**: ${row.calories_kcal} kcal | ${row.protein_g}g protein | ${row.carbs_g}g carbs | ${row.fat_g}g fat (per 100g)`
  ).join("\n");

  return {
    text: `${prefixMessage}\n\n${foodsList}`,
    foods: result.rows
  };
}

export async function getChatbotResponse(message) {
  const text = message.toLowerCase();
  
  if (text.includes("protein") || text.includes("muscle")) {
    return await queryFoods("protein_g", "DESC", 5, "Here are some of the highest-protein Indian foods from our dataset:");
  } else if (text.includes("low carb") || text.includes("keto")) {
    return await queryFoods("carbs_g", "ASC", 5, "These foods are lowest in carbohydrates:");
  } else if (text.includes("low fat")) {
    return await queryFoods("fat_g", "ASC", 5, "Check out these low-fat options:");
  } else if (text.includes("calories") || text.includes("weight loss") || text.includes("lose weight")) {
    return await queryFoods("calories_kcal", "ASC", 5, "Here are some low-calorie foods that might help with weight loss:");
  } else if (text.includes("iron")) {
    return await queryFoods("iron_mg", "DESC", 5, "Here are some iron-rich foods:");
  } else if (text.includes("calcium")) {
    return await queryFoods("calcium_mg", "DESC", 5, "Here are some calcium-rich foods:");
  } else {
    return {
      text: "I can help you find foods based on your goals! Try asking me for 'high protein', 'low carb', 'low calorie', 'iron rich', or 'calcium rich' foods."
    };
  }
}
