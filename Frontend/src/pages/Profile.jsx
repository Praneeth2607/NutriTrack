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
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "settings"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        if (data && data.user_id) {
          setFormData({
            age: data.age || "",
            gender: data.gender || "male",
            height_cm: data.height_cm || "",
            weight_kg: data.weight_kg || "",
            activity_level: data.activity_level || "sedentary",
            goal: data.goal || "maintain"
          });
          setUser({
            username: data.username || "user",
            full_name: data.full_name || "NutriTrack User",
            email: data.email || ""
          });
          setStats({
            target_calories: data.target_calories,
            target_protein_g: data.target_protein_g,
            bmi: data.height_cm && data.weight_kg ? (data.weight_kg / Math.pow(data.height_cm / 100, 2)).toFixed(1) : "N/A"
          });
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProfile(formData);
      setMessage("Profile updated successfully!");
      setStats({
        target_calories: data.target_calories,
        target_protein_g: data.target_protein_g,
        bmi: data.height_cm && data.weight_kg ? (data.weight_kg / Math.pow(data.height_cm / 100, 2)).toFixed(1) : "N/A"
      });
      setTimeout(() => setMessage(""), 3000);
      setActiveTab("overview");
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-white/60 relative mb-8">
        {/* Cover Gradient */}
        <div className="h-40 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        {/* Profile Info Area */}
        <div className="px-8 pb-8 pt-20 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8 bg-white p-1 rounded-full shadow-lg">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center text-4xl font-bold text-green-700 border-4 border-white">
                    {user.full_name?.charAt(0) || "U"}
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">{user.full_name}</h1>
                    <p className="text-green-600 font-semibold tracking-wide">@{user.username}</p>
                    <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab(activeTab === "overview" ? "settings" : "overview")}
                        className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${activeTab === "settings" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"}`}
                    >
                        {activeTab === "settings" ? "View Profile" : "Edit Profile"}
                    </button>
                </div>
            </div>
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50/50">
            <div className="p-4 text-center border-r border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">BMI</span>
                <span className="text-xl font-black text-gray-800">{stats?.bmi || "—"}</span>
            </div>
            <div className="p-4 text-center border-r border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Kcal</span>
                <span className="text-xl font-black text-green-600">{stats?.target_calories || "—"}</span>
            </div>
            <div className="p-4 text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Target Protein</span>
                <span className="text-xl font-black text-blue-600">{stats?.target_protein_g || "—"}g</span>
            </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/60 min-h-[400px]">
        {message && (
            <div className="mb-6 animate-slide-in p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center gap-2">
                <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                {message}
            </div>
        )}

        {activeTab === "overview" ? (
            <div className="space-y-8 animate-fade-in-up">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Biometric Overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-50 hover:shadow-md transition-shadow">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Body Composition</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium whitespace-nowrap">Age</span>
                                <span className="text-gray-900 font-bold">{formData.age} years</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium whitespace-nowrap">Gender</span>
                                <span className="text-gray-900 font-bold capitalize">{formData.gender}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium whitespace-nowrap">Height</span>
                                <span className="text-gray-900 font-bold">{formData.height_cm} cm</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium whitespace-nowrap">Weight</span>
                                <span className="text-gray-900 font-bold">{formData.weight_kg} kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-50 hover:shadow-md transition-shadow">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Lifestyle & Goals</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium whitespace-nowrap">Activity</span>
                                <span className="text-gray-900 font-bold capitalize">{formData.activity_level.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium whitespace-nowrap">Health Goal</span>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{formData.goal} weight</span>
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-white/50 rounded-xl border border-blue-100 italic text-sm text-gray-500">
                           "Your current plan is optimized for {formData.goal === 'maintain' ? 'longevity and stability' : formData.goal + 'ing weight safely'}."
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Your Metrics</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase px-1">Current Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 p-4 font-semibold text-gray-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase px-1">Gender Identification</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 p-4 font-semibold text-gray-800">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase px-1">Height (Centimeters)</label>
                            <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} required className="w-full bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 p-4 font-semibold text-gray-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase px-1">Weight (Kilograms)</label>
                            <input type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} required className="w-full bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 p-4 font-semibold text-gray-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase px-1">Physical Activity Level</label>
                            <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 p-4 font-semibold text-gray-800">
                                <option value="sedentary">Sedentary (Office job)</option>
                                <option value="light">Lightly Active (1-3 days/week)</option>
                                <option value="moderate">Moderately Active (3-5 days/week)</option>
                                <option value="active">Very Active (6-7 days/week)</option>
                                <option value="very_active">Extra Active (Athlete/Physical job)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase px-1">Primary Health Goal</label>
                            <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 p-4 font-semibold text-gray-800">
                                <option value="lose">Lose Weight</option>
                                <option value="maintain">Maintain Weight</option>
                                <option value="gain">Gain Weight</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-black py-4 px-8 rounded-2xl hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-95 text-lg uppercase tracking-widest">
                            Update & Recalculate Plans
                        </button>
                    </div>
                </form>
            </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
      `}} />
    </div>
  );
}
