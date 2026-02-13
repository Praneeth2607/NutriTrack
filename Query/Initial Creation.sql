CREATE TABLE datasets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year INT,
  source TEXT,
  imported_at TIMESTAMP DEFAULT now()
);

INSERT INTO datasets (name, year, source)
VALUES (
  'Indian Prepared Foods Nutrition Dataset',
  2024,
  'Kaggle / IFCT derived'
);

CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  dataset_id INT REFERENCES datasets(id)
);

CREATE TABLE food_nutrients (
  food_id INT PRIMARY KEY REFERENCES foods(id),

  calories_kcal NUMERIC,
  carbs_g NUMERIC,
  protein_g NUMERIC,
  fat_g NUMERIC,
  free_sugar_g NUMERIC,
  fibre_g NUMERIC,

  sodium_mg NUMERIC,
  calcium_mg NUMERIC,
  iron_mg NUMERIC,
  vitamin_c_mg NUMERIC,
  folate_ug NUMERIC,

  base_quantity_g NUMERIC DEFAULT 100
);

CREATE TABLE foods_raw (
  dish_name TEXT,
  calories_kcal NUMERIC,
  carbs_g NUMERIC,
  protein_g NUMERIC,
  fat_g NUMERIC,
  free_sugar_g NUMERIC,
  fibre_g NUMERIC,
  sodium_mg NUMERIC,
  calcium_mg NUMERIC,
  iron_mg NUMERIC,
  vitamin_c_mg NUMERIC,
  folate_ug NUMERIC
);

CREATE INDEX idx_foods_name
ON foods
USING gin (to_tsvector('english', name));

--- in psql 
--- \copy foods_raw FROM 'C:/Users/study/Downloads/indian_foods.csv' CSV HEADER;

select * from foods;

INSERT INTO foods (name, dataset_id)
SELECT dish_name, 1
FROM foods_raw;

select * from foods;

INSERT INTO food_nutrients (
  food_id,
  calories_kcal,
  carbs_g,
  protein_g,
  fat_g,
  free_sugar_g,
  fibre_g,
  sodium_mg,
  calcium_mg,
  iron_mg,
  vitamin_c_mg,
  folate_ug,
  base_quantity_g
)
SELECT
  f.id,
  r.calories_kcal,
  r.carbs_g,
  r.protein_g,
  r.fat_g,
  r.free_sugar_g,
  r.fibre_g,
  r.sodium_mg,
  r.calcium_mg,
  r.iron_mg,
  r.vitamin_c_mg,
  r.folate_ug,
  100
FROM foods_raw r
JOIN foods f
  ON f.name = r.dish_name;


SELECT f.name, n.calories_kcal, n.protein_g
FROM foods f
JOIN food_nutrients n ON f.id = n.food_id
LIMIT 10;

SELECT COUNT(*) FROM food_nutrients;
