import { useState, useEffect } from "react";
import { getProfile } from "../services/profile";
import { getDailyLogs, getWeeklyLogs, deleteFoodLog } from "../services/intake";
import FoodSearch from "../components/FoodSearch";

// Component for a sophisticated Radial Progress Ring
const ProgressRing = ({ percentage, color, label, icon, subtext }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative group p-4">
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {/* Background Track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%" cy="50%" r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100/50"
          />
          {/* Progress Circle */}
          <circle
            cx="50%" cy="50%" r={radius}
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color === 'green' ? '#10b981' : '#3b82f6'} />
              <stop offset="100%" stopColor={color === 'green' ? '#34d399' : '#6366f1'} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-gray-800 tracking-tighter">{percentage}%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-lg">{icon}</span>
            <span className="font-extrabold text-gray-700">{subtext}</span>
        </div>
      </div>
    </div>
  );
};

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
      setError(err.message || "Failed to load interactive dashboard.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (logId) => {
    try {
      await deleteFoodLog(logId);
      fetchData();
    } catch(err) { console.error(err); }
  };

  if (!profile && !error) return (
    <div className="min-h-screen flex items-center justify-center">
         <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-3xl mb-4 flex items-center justify-center">
                <span className="text-3xl animate-bounce">🌱</span>
            </div>
            <p className="text-green-800 font-black uppercase tracking-widest text-xs">Calibrating Nutrients...</p>
         </div>
    </div>
  );

  const sum = intakeData.summary || {};
  const consumedCals = Number(sum.total_calories || 0);
  const targetCals = Number(profile?.target_calories || 2000);
  const calPercent = Math.round((consumedCals / targetCals) * 100) || 0;

  const consumedPro = Number(sum.total_protein || 0);
  const targetPro = Number(profile?.target_protein_g || 50);
  const proPercent = Math.round((consumedPro / targetPro) * 100) || 0;

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 relative">
      
      {/* Dynamic Animated Background Assets */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <img src="/dashboard_hero_bg_1774790398014.png" className="w-full h-full object-cover blur-[50px]" alt="" />
      </div>

      <div className="max-w-7xl mx-auto pt-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
            <div>
                <h4 className="text-xs font-black text-green-600 uppercase tracking-[0.3em] mb-2">NutriTrack Performance</h4>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">Overview</span></h1>
            </div>
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60">
                <div className="px-4 py-2 bg-white rounded-xl shadow-sm">
                    <span className="text-xs font-bold text-gray-400 block uppercase">Calendar</span>
                    <span className="font-extrabold text-gray-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,_auto)]">
          
          {/* Module 1: Hero Visual (Double Width) */}
          <div className="lg:col-span-2 row-span-2 bg-gradient-to-br from-green-600 to-teal-700 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
             <img src="/healthy_food_abstract_1774790437400.png" className="absolute top-0 right-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-[3s]" alt="" />
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                   <span className="bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">Creative Insight</span>
                   <h2 className="text-3xl font-black text-white mt-6 leading-tight max-w-[80%]">"Fueling your body is the highest form of self-respect."</h2>
                </div>
                {!profile?.target_calories && (
                    <a href="/profile" className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl transition-all self-start">
                        Setup Profile <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                )}
             </div>
          </div>

          {/* Module 2: Macro Ring (Calories) */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
             <ProgressRing percentage={calPercent} color="green" label="Calories" icon="🔥" subtext={`${consumedCals.toFixed(0)} / ${targetCals}`} />
          </div>

          {/* Module 3: Macro Ring (Protein) */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
             <ProgressRing percentage={proPercent} color="blue" label="Protein" icon="🥩" subtext={`${consumedPro.toFixed(0)} / ${targetPro}g`} />
          </div>

          {/* Module 4: Food Logger (Double Height) */}
          <div className="lg:col-span-1 lg:row-span-2 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 p-8 shadow-xl flex flex-col">
             <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-gray-800 tracking-tighter">Energy Intake</h3>
                 <span className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-lg">➕</span>
             </div>
             <div className="flex-1 overflow-visible relative">
                <FoodSearch onLogAdded={fetchData} />
             </div>
          </div>

          {/* Module 5: Macros (Carbs & Fat) */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
             <div className="flex flex-col gap-6">
                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Carbohydrates</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-800">{Number(sum.total_carbs || 0).toFixed(0)}</span>
                        <span className="text-sm font-bold text-gray-400 uppercase">Grams</span>
                    </div>
                 </div>
                 <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '45%' }}></div>
                 </div>
             </div>
          </div>

          {/* Module 6: Fat Stats */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
             <div className="flex flex-col gap-6">
                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Healthy Fats</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-800">{Number(sum.total_fat || 0).toFixed(0)}</span>
                        <span className="text-sm font-bold text-gray-400 uppercase">Grams</span>
                    </div>
                 </div>
                 <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: '30%' }}></div>
                 </div>
             </div>
          </div>

          {/* Module 7: Historical Chart (Full Width) */}
          <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-800 tracking-tighter">Performance History</h3>
                <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Intake</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 border border-dashed border-gray-400 rounded-full"></span> Goal</span>
                </div>
             </div>
             
             {/* Chart Component - Refined Version */}
             <div className="flex items-end h-48 gap-4 pt-6">
                {(() => {
                    const days = [];
                    for (let i = 6; i >= 0; i--) {
                        const d = new Date(); d.setDate(d.getDate() - i);
                        days.push(d.toISOString().split('T')[0]);
                    }
                    const maxVal = Math.max(targetCals, ...weeklyData.map(d => Number(d.total_calories))) || 1;
                    
                    return days.map(day => {
                        const w = weeklyData.find(d => d.date === day);
                        const cals = w ? Number(w.total_calories) : 0;
                        const h = (cals / maxVal) * 100;
                        const isToday = day === new Date().toISOString().split('T')[0];

                        return (
                            <div key={day} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                <div className="absolute w-full border-t border-dashed border-gray-200" style={{ bottom: `${(targetCals/maxVal)*100}%` }}></div>
                                <div 
                                    className={`w-full rounded-t-2xl transition-all duration-1000 ease-out relative z-10 ${isToday ? 'bg-gradient-to-t from-green-600 to-teal-400 shadow-lg shadow-green-200' : 'bg-gray-100'}`}
                                    style={{ height: `${Math.max(h, 5)}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {cals.toFixed(0)} kcal
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black mt-3 uppercase tracking-widest ${isToday ? 'text-green-600' : 'text-gray-400'}`}>
                                    {new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                            </div>
                        );
                    });
                })()}
             </div>
          </div>

          {/* Module 8: Log History (Timeline) */}
          <div className="lg:col-span-1 row-span-2 bg-gradient-to-b from-white to-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col">
             <h3 className="text-xl font-black text-gray-800 tracking-tighter mb-8">Daily Log</h3>
             <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                {intakeData.logs?.length > 0 ? (
                    intakeData.logs.map(log => (
                        <div key={log.log_id} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className="w-1.5 h-full bg-gray-100 rounded-full relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-green-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-black text-gray-800 leading-tight uppercase tracking-tight">{log.food_name}</p>
                                    <button onClick={() => handleDelete(log.log_id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{log.meal_type} • {log.quantity_g}g</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
                        <span className="text-4xl mb-2">🍽️</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">No Entries</p>
                    </div>
                )}
             </div>
          </div>

          {/* Module 9: Micronutrient QuickView */}
          <div className="lg:col-span-3 flex flex-wrap gap-4 overflow-x-auto pb-4">
               {[
                 { l: "Fibre", v: sum.total_fibre, unit: "g", c: "bg-green-100 text-green-700" },
                 { l: "Iron", v: sum.total_iron, unit: "mg", c: "bg-red-100 text-red-700" },
                 { l: "Vitamin C", v: sum.total_vitamin_c, unit: "mg", c: "bg-orange-100 text-orange-700" },
                 { l: "Sodium", v: sum.total_sodium, unit: "mg", c: "bg-gray-100 text-gray-700" },
                 { l: "Sugar", v: sum.total_sugar, unit: "g", c: "bg-pink-100 text-pink-700" }
               ].map((m, idx) => (
                 <div key={idx} className="flex-1 min-w-[120px] bg-white rounded-3xl p-4 border border-gray-100 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{m.l}</span>
                    <span className={`text-xl font-black ${m.c.split(' ')[1]}`}>{Number(m.v || 0).toFixed(1)}<span className="text-[10px] ml-0.5 opacity-60">{m.unit}</span></span>
                 </div>
               ))}
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}} />
    </div>
  );
}
