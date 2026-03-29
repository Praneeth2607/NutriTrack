import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/profile";

export default function Profile() {
  const [formData, setFormData] = useState({
    age: "", gender: "male", height_cm: "", weight_kg: "",
    activity_level: "sedentary", goal: "maintain"
  });
  const [user, setUser] = useState({ username: "", full_name: "", email: "" });
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        if (data && data.user_id) {
          setFormData({
            age: data.age || "", gender: data.gender || "male",
            height_cm: data.height_cm || "", weight_kg: data.weight_kg || "",
            activity_level: data.activity_level || "sedentary", goal: data.goal || "maintain"
          });
          setUser({ username: data.username || "user", full_name: data.full_name || "User", email: data.email || "" });
          setStats({
            target_calories: data.target_calories,
            target_protein_g: data.target_protein_g,
            bmi: data.height_cm && data.weight_kg ? (data.weight_kg / Math.pow(data.height_cm / 100, 2)).toFixed(1) : "N/A"
          });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProfile(formData);
      setMessage("Profile Updated");
      setStats({
        target_calories: data.target_calories,
        target_protein_g: data.target_protein_g,
        bmi: data.height_cm && data.weight_kg ? (data.weight_kg / Math.pow(data.height_cm / 100, 2)).toFixed(1) : "N/A"
      });
      setTimeout(() => setMessage(""), 3000);
      setActiveTab("overview");
    } catch (err) { setMessage("Update Failed"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-green-600 font-black uppercase tracking-widest text-xs">Syncing Body Metrics...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in relative px-4">
      
      {/* Background Asset */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <img src="/dashboard_hero_bg_1774790398014.png" className="w-full h-full object-cover blur-[80px]" alt="" />
      </div>

      <div className="relative z-10 pt-10">
        
        {/* Profile Identity Module */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-xl border border-white/60 p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-6xl shadow-2xl shadow-green-200 rotate-3 transition-transform hover:rotate-0">
                {user.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 text-center md:text-left">
                <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-3">Verified Nutrition Member</h4>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{user.full_name}</h1>
                <p className="text-xl font-bold text-gray-400">@{user.username} <span className="mx-2 opacity-20">/</span> {user.email}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                    <button onClick={() => setActiveTab("overview")} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "overview" ? "bg-gray-900 text-white shadow-xl" : "bg-white text-gray-400 border border-gray-100"}`}>Overview</button>
                    <button onClick={() => setActiveTab("settings")} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "settings" ? "bg-gray-900 text-white shadow-xl" : "bg-white text-gray-400 border border-gray-100"}`}>Edit Metrics</button>
                </div>
            </div>
        </div>

        {/* Bento Grid Content */}
        {activeTab === "overview" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                
                {/* BMI Bento Module */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center group hover:shadow-2xl transition-all">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Body Mass Index</span>
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-[10px] border-gray-50 flex items-center justify-center">
                            <span className="text-4xl font-black text-gray-800">{stats?.bmi || "—"}</span>
                        </div>
                        <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
                    </div>
                    <p className="text-[10px] font-bold text-green-600 uppercase mt-6 tracking-widest">Normal Range</p>
                </div>

                {/* Biometric Bento Module (Large) */}
                <div className="md:col-span-2 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 tracking-tighter mb-8">Physique Details</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { l: "Age", v: formData.age + "y", i: "⏳" },
                            { l: "Gender", v: formData.gender, i: "🚻" },
                            { l: "Height", v: formData.height_cm + "cm", i: "📏" },
                            { l: "Weight", v: formData.weight_kg + "kg", i: "⚖️" }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.l}</span>
                                <span className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                                    <span className="text-sm grayscale opacity-50">{stat.i}</span> {stat.v}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lifestyle & Strategy Module */}
                <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-[80px] group-hover:bg-teal-500/30 transition-colors duration-1000"></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] mb-6 block">Current Strategy</span>
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="flex-1">
                                <h2 className="text-4xl font-black tracking-tighter mb-2 capitalize">{formData.goal} Weight</h2>
                                <p className="text-gray-400 font-medium">Your metabolic rate is tuned for <span className="text-white">{formData.activity_level.replace('_', ' ')}</span> lifestyle behavior.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[100px]">
                                    <span className="block text-[9px] font-black uppercase text-gray-400 mb-1">Target</span>
                                    <span className="text-xl font-black">{stats?.target_calories} Kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Action Bento */}
                <div className="bg-green-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center border border-green-200 hover:bg-green-200 transition-colors cursor-pointer group">
                    <span className="text-4xl mb-4 transform group-hover:scale-125 transition-transform">📊</span>
                    <h4 className="text-sm font-black text-green-800 uppercase tracking-widest">Growth Plan</h4>
                    <p className="text-[10px] font-bold text-green-600 uppercase mt-2">Active Since 2024</p>
                </div>

            </div>
        ) : (
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-50 animate-fade-in-up">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Modify Biometrics</h2>
                    {message && <span className="bg-green-500 text-white text-[10px] font-black px-4 py-2 rounded-full animate-bounce uppercase tracking-widest">{message}</span>}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { id: "age", label: "Age", type: "number", icon: "⏳" },
                            { id: "height_cm", label: "Height (CM)", type: "number", icon: "📏" },
                            { id: "weight_kg", label: "Weight (KG)", type: "number", icon: "⚖️" }
                        ].map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{field.label}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">{field.icon}</span>
                                    <input type={field.type} name={field.id} value={formData[field.id]} onChange={handleChange} required className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-12 font-black text-gray-700 focus:ring-4 focus:ring-green-500/10 transition-all" />
                                </div>
                            </div>
                        ))}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-black text-gray-700 focus:ring-4 focus:ring-green-500/10 transition-all">
                                <option value="male">Male Member</option>
                                <option value="female">Female Member</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Activity Level</label>
                            <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-black text-gray-700 focus:ring-4 focus:ring-green-500/10 transition-all">
                                <option value="sedentary">Sedentary (No Exercise)</option>
                                <option value="light">Lightly Active</option>
                                <option value="moderate">Moderately Active</option>
                                <option value="active">Very Active</option>
                                <option value="very_active">Extra Active</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Primary Goal</label>
                            <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-black text-gray-700 focus:ring-4 focus:ring-green-500/10 transition-all text-green-700">
                                <option value="lose">Aggressive Fat Loss</option>
                                <option value="maintain">Body Recomposition</option>
                                <option value="gain">Lean Muscle Gain</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white font-black py-6 rounded-[2rem] text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform hover:scale-[1.01] active:scale-95">
                        Commence Recalculation
                    </button>
                </form>
            </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}} />
    </div>
  );
}
