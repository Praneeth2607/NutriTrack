import pool from "../../config/db.js";

function calculateTargets(age, gender, height_cm, weight_kg, activity_level, goal) {
  // calculate BMR using Mifflin-St Jeor Equation
  let bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  bmr += (gender === 'male') ? 5 : -161;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  const multiplier = activityMultipliers[activity_level] || 1.2;
  let tdee = bmr * multiplier;

  let target_calories = tdee;
  if (goal === 'lose') target_calories -= 500;
  else if (goal === 'gain') target_calories += 500;

  let protein_factor = 1.2;
  if (activity_level === 'active' || activity_level === 'very_active') protein_factor = 1.6;
  if (goal === 'lose' || goal === 'gain') protein_factor += 0.4;
  
  let target_protein_g = weight_kg * protein_factor;

  return {
    target_calories: Math.round(target_calories),
    target_protein_g: Math.round(target_protein_g)
  };
}

export async function getProfile(userId) {
  const query = `
    SELECT p.*, u.username, u.full_name, u.email 
    FROM user_profiles p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
}

export async function updateProfile(userId, profileData) {
  const { age, gender, height_cm, weight_kg, activity_level, goal } = profileData;
  
  const { target_calories, target_protein_g } = calculateTargets(
    Number(age), String(gender).toLowerCase(), Number(height_cm), Number(weight_kg), String(activity_level).toLowerCase(), String(goal).toLowerCase()
  );

  const query = `
    INSERT INTO user_profiles 
      (user_id, age, gender, height_cm, weight_kg, activity_level, goal, target_calories, target_protein_g)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      age = EXCLUDED.age,
      gender = EXCLUDED.gender,
      height_cm = EXCLUDED.height_cm,
      weight_kg = EXCLUDED.weight_kg,
      activity_level = EXCLUDED.activity_level,
      goal = EXCLUDED.goal,
      target_calories = EXCLUDED.target_calories,
      target_protein_g = EXCLUDED.target_protein_g
    RETURNING *;
  `;

  const values = [
    userId, age, gender, height_cm, weight_kg, activity_level, goal, target_calories, target_protein_g
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}
