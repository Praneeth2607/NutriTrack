import { useState, useEffect } from "react";
import { getProfile } from "../services/profile";
import { getDailyLogs, getWeeklyLogs, deleteFoodLog } from "../services/intake";
import FoodSearch from "../components/FoodSearch";

// SVG Icons
const MacroIcon = ({ color }) => (
  <svg className={`w-6 h-6 text-${color}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [intakeData, setIntakeData] = useState({ summary: {}, logs: [] });
  const [weeklyData, setWeeklyData] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const pData = await getProfile();
      setProfile(pData);
      
      const dateString = new Date().toISOString().split('T')[0];
      const iData = await getDailyLogs(dateString);
      setIntakeData(iData || { summary: {}, logs: [] });
      
      const wData = await getWeeklyLogs(dateString);
      setWeeklyData(wData || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (logId) => {
    try {
      await deleteFoodLog(logId);
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-red-100">
          <p className="text-red-600 font-semibold text-lg flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-green-800 font-medium tracking-wide animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const sum = intakeData.summary || {};
  const consumedCals = Number(sum.total_calories || 0);
  const targetCals = Number(profile.target_calories || 2000);
  const calPercent = Math.min(Math.round((consumedCals / targetCals) * 100) || 0, 100);

  const consumedPro = Number(sum.total_protein || 0);
  const targetPro = Number(profile.target_protein_g || 50);
  const proPercent = Math.min(Math.round((consumedPro / targetPro) * 100) || 0, 100);

  return (
    <div className="min-h-screen font-sans max-w-7xl mx-auto flex flex-col xl:flex-row gap-8 pb-12">
      
      {/* LEFT COLUMN: Overview & Stats */}
      <div className="flex-1 space-y-8 animate-fade-in-up">
        
        {/* Header Hero */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-teal-600 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 font-medium">Here's your nutritional breakdown for today.</p>
          
          {(!profile.target_calories) && (
            <div className="mt-4 bg-orange-50/80 backdrop-blur border border-orange-200 text-orange-800 px-5 py-4 rounded-xl shadow-sm text-sm font-medium flex items-center gap-3 transition-transform hover:scale-[1.01]">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span>Set up your <a href="/profile" className="underline decoration-orange-400 decoration-2 hover:text-orange-900 transition-colors">Profile</a> to calculate personalized goals.</span>
            </div>
          )}
        </div>

        {/* MACRONUTRIENTS GRID */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Macronutrients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Calories Card */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-semibold tracking-wide uppercase text-sm">Calories</h3>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <span className="text-orange-600 text-lg">🔥</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-extrabold text-gray-800">{consumedCals.toFixed(0)}</span>
                <span className="text-gray-400 font-medium">/ {targetCals} kcal</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                  style={{ width: `${calPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Protein Card */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-semibold tracking-wide uppercase text-sm">Protein</h3>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 text-lg">🥩</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-extrabold text-gray-800">{consumedPro.toFixed(0)}</span>
                <span className="text-gray-400 font-medium">/ {targetPro} g</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                  style={{ width: `${proPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Carbs Card */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-500 font-semibold tracking-wide uppercase text-sm">Carbs</h3>
                <span className="text-yellow-600 text-xl">🌾</span>
              </div>
              <div className="text-3xl font-extrabold text-gray-800">{Number(sum.total_carbs || 0).toFixed(0)} <span className="text-lg text-gray-500 font-medium">g</span></div>
            </div>
            
            {/* Fat Card */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-500 font-semibold tracking-wide uppercase text-sm">Fat</h3>
                <span className="text-yellow-400 text-xl">🥑</span>
              </div>
              <div className="text-3xl font-extrabold text-gray-800">{Number(sum.total_fat || 0).toFixed(0)} <span className="text-lg text-gray-500 font-medium">g</span></div>
            </div>
          </div>
        </div>

        {/* MICRONUTRIENTS GRID */}
        <div>
           <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Micronutrients & Others</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Fibre", value: sum.total_fibre, unit: "g", color: "text-green-600", bg: "bg-green-50" },
                { label: "Sugar", value: sum.total_sugar, unit: "g", color: "text-pink-600", bg: "bg-pink-50" },
                { label: "Sodium", value: sum.total_sodium, unit: "mg", color: "text-gray-600", bg: "bg-gray-100" },
                { label: "Calcium", value: sum.total_calcium, unit: "mg", color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Iron", value: sum.total_iron, unit: "mg", color: "text-red-700", bg: "bg-red-50" },
                { label: "Vitamin C", value: sum.total_vitamin_c, unit: "mg", color: "text-orange-500", bg: "bg-orange-50" },
                { label: "Folate", value: sum.total_folate, unit: "µg", color: "text-purple-600", bg: "bg-purple-50" }
              ].map((item, idx) => (
                <div key={idx} className={`rounded-2xl p-4 shadow-sm border border-white/60 hover:shadow-md transition-shadow relative overflow-hidden backdrop-blur-md ${item.bg}`}>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/40 blur-xl"></div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.label}</h4>
                  <p className={`text-xl font-extrabold ${item.color}`}>
                    {Number(item.value || 0).toFixed(1)} <span className="text-xs font-medium opacity-70">{item.unit}</span>
                  </p>
                </div>
              ))}
           </div>
        </div>

        {/* WEEKLY REPORT CHART */}
        <div className="mt-6">
           <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Last 7 Days <span className="text-sm font-medium text-gray-500 ml-2">(Calories)</span></h2>
           <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-shadow">
             <div className="flex items-end h-48 gap-3 sm:gap-6 pt-6">
               {(() => {
                 const days = [];
                 for (let i = 6; i >= 0; i--) {
                   const d = new Date();
                   d.setDate(d.getDate() - i);
                   days.push(d.toISOString().split('T')[0]);
                 }
                 
                 const maxCals = Math.max(targetCals, ...weeklyData.map(d => Number(d.total_calories)));
                 
                 return days.map(day => {
                   const w = weeklyData.find(d => d.date === day);
                   const cals = w ? Number(w.total_calories) : 0;
                   
                   // Guard against 0 maxCals, floor to 2% so empty bars are visible slightly
                   let heightPct = maxCals > 0 ? (cals / maxCals) * 100 : 0;
                   if (heightPct < 2) heightPct = 2;

                   const isToday = day === new Date().toISOString().split('T')[0];
                   const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
                   
                   return (
                     <div key={day} className="flex-1 flex flex-col items-center justify-end h-full gap-3 group">
                        <div className="relative w-full flex justify-center items-end h-[120px] border-b-2 border-green-100 pb-1">
                           
                           {/* Target Line marker (only if targetCals <= maxCals) */}
                           {targetCals > 0 && (
                             <div 
                               className="absolute w-full border-t border-dashed border-gray-300 z-0"
                               style={{ bottom: `${(targetCals / maxCals) * 100}%` }}
                               title={`Goal: ${targetCals} kcal`}
                             />
                           )}

                           <div 
                             className={`w-full max-w-[48px] rounded-t-lg transition-all duration-700 ease-out z-10 hover:opacity-80 shadow-sm ${isToday ? 'bg-gradient-to-t from-orange-400 to-red-500' : 'bg-gradient-to-t from-green-400 to-teal-500'}`}
                             style={{ height: `${heightPct}%` }}
                           ></div>
                           
                           <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-lg pointer-events-none z-20 whitespace-nowrap">
                             {cals.toFixed(0)} kcal
                           </span>
                        </div>
                        <span className={`text-xs sm:text-sm font-bold tracking-wide ${isToday ? 'text-gray-900 bg-gray-100 px-2 py-1 rounded uppercase' : 'text-gray-500 uppercase'}`}>{dayName}</span>
                     </div>
                   );
                 });
               })()}
             </div>
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Timeline & Logger */}
      <div className="w-full xl:w-[400px] flex flex-col gap-6">
        
        {/* The FoodSearch component handles the input styling */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 overflow-hidden transform hover:shadow-2xl transition-shadow duration-300">
           <FoodSearch onLogAdded={fetchData} />
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 p-6 flex-1 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Today's Intake</h3>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">{intakeData.logs?.length || 0} items</span>
          </div>
          
          {intakeData.logs && intakeData.logs.length > 0 ? (
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
              {intakeData.logs.map((log) => (
                <div key={log.log_id} className="relative pl-6 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white border-4 border-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  
                  <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 group-hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-bold text-gray-800 leading-tight">{log.food_name}</p>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">{log.meal_type} • {log.quantity_g}g</p>
                      </div>
                      <button onClick={() => handleDelete(log.log_id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remove log">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
                      <span className="flex items-center gap-1 text-orange-600"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>{log.calories} kcal</span>
                      <span className="text-blue-600">{log.protein}g P</span>
                      <span className="text-yellow-600">{log.carbs}g C</span>
                      <span className="text-red-500">{log.fat}g F</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
              <svg className="w-16 h-16 text-gray-200 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">No food logged today.</p>
              <p className="text-xs mt-1">Search above to get started!</p>
            </div>
          )}
        </div>
      </div>
{/* Custom Styles / Animations inserted via style tag or Tailwind */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
}
