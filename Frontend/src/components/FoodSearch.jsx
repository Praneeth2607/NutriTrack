import { useState } from "react";
import { searchFoods } from "../services/food";
import { addFoodLog } from "../services/intake";

export default function FoodSearch({ onLogAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState("lunch");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const data = await searchFoods(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLog = async (e) => {
    e.preventDefault();
    if (!selectedFood) return;
    try {
      await addFoodLog({
        food_id: selectedFood.id,
        meal_type: mealType,
        quantity_g: Number(quantity),
        consumed_date: new Date().toISOString().split('T')[0]
      });
      onLogAdded();
      setSelectedFood(null);
      setQuery("");
      setResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border mb-6">
      <h3 className="text-lg font-bold mb-4">Log Food</h3>
      
      {!selectedFood ? (
        <div>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Search Indian foods..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Search
            </button>
          </form>

          {loading && <p>Searching...</p>}
          
          {results.length > 0 && (
            <ul className="max-h-60 overflow-y-auto space-y-2">
              {results.map((food) => (
                <li key={food.id} className="p-2 border rounded hover:bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => setSelectedFood(food)}>
                  <div>
                    <span className="font-medium">{food.name}</span>
                    <span className="text-xs text-gray-500 block">{food.calories_kcal} kcal / 100g</span>
                  </div>
                  <button className="text-green-600 text-sm font-bold">Select</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <form onSubmit={handleLog} className="space-y-4">
          <div className="bg-green-50 p-3 rounded flex justify-between items-center">
            <span className="font-bold">{selectedFood.name}</span>
            <button type="button" onClick={() => setSelectedFood(null)} className="text-gray-500 text-sm">Cancel</button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Quantity (grams)</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Meal</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snack">Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">
            Log Intake
          </button>
        </form>
      )}
    </div>
  );
}
