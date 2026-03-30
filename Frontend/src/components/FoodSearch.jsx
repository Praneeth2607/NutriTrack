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
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full">
      {!selectedFood ? (
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Search Indian foods..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-50/50 border-none rounded-2xl px-5 py-4 font-bold text-gray-700 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300 placeholder:font-normal"
            />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 uppercase tracking-widest text-xs">
              {loading ? "Searching..." : "Search Database"}
            </button>
          </form>

          {results.length > 0 && (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100 overflow-hidden shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar animate-fade-in">
              {results.map((food) => (
                <div key={food.id} className="p-4 border-b border-gray-50 hover:bg-white flex justify-between items-center cursor-pointer transition-colors" onClick={() => setSelectedFood(food)}>
                  <div>
                    <span className="font-extrabold text-gray-800 text-xs block uppercase tracking-tighter">{food.name}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{food.calories_kcal} kcal / 100g</span>
                  </div>
                  <span className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-lg transition-all shadow-inner placeholder:text-gray-300 placeholder:font-normal">
                    ›
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleLog} className="space-y-6 animate-fade-in-up">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-[2rem] border border-green-100 flex justify-between items-center group">
            <div className="flex-1">
                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest block mb-1">Selected Unit</span>
                <span className="font-black text-green-900 text-sm">{selectedFood.name}</span>
            </div>
            <button type="button" onClick={() => setSelectedFood(null)} className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Quantity (g)</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-black text-gray-700 focus:ring-4 focus:ring-green-500/10 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Meal Block</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-black text-gray-700 focus:ring-4 focus:ring-green-500/10 transition-all">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snack">Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 uppercase tracking-[0.2em] text-xs">
            Commit Entry
          </button>
        </form>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}} />
    </div>
  );
}
