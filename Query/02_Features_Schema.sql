-- Table for storing detailed user profile information for calculations
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    age INT,
    gender VARCHAR(10), -- 'male', 'female', 'other'
    height_cm NUMERIC,
    weight_kg NUMERIC,
    activity_level VARCHAR(50), -- 'sedentary', 'light', 'moderate', 'active', 'very_active'
    goal VARCHAR(50), -- 'lose', 'maintain', 'gain'
    
    -- Cached calculated targets
    target_calories NUMERIC,
    target_protein_g NUMERIC,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to update updated_at timestamp automatically
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Table for logging daily food consumption
CREATE TABLE food_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_id INT NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    
    consumed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(20) NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
    quantity_g NUMERIC NOT NULL DEFAULT 100,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index to quickly query daily food logs for a user
CREATE INDEX idx_food_logs_user_date ON food_logs(user_id, consumed_date);
