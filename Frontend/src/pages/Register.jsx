import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    email: "", username: "", password: "", full_name: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.data?.message || "Registration Failed.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden animate-fade-in">
      
      {/* Background Asset */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <img src="/dashboard_hero_bg_1774790398014.png" className="w-full h-full object-cover blur-[60px]" alt="" />
      </div>

      <div className="w-full max-w-[500px] relative z-10">
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/60 p-8 md:p-10">
            
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">Create Account</h1>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Initialize Your Journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Member Name</label>
                        <input name="full_name" required placeholder="Full Name" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-xl p-4 font-black text-gray-700 focus:ring-8 focus:ring-green-500/5 transition-all outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Alias (Username)</label>
                        <input name="username" required placeholder="username" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-xl p-4 font-black text-gray-700 focus:ring-8 focus:ring-green-500/5 transition-all outline-none" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Communication (Email)</label>
                    <input name="email" type="email" required placeholder="identity@neural.com" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-xl p-4 font-black text-gray-700 focus:ring-8 focus:ring-green-500/5 transition-all outline-none" />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Privacy Key</label>
                    <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} className="w-full bg-gray-50 border-none rounded-xl p-4 font-black text-gray-700 focus:ring-8 focus:ring-green-500/5 transition-all outline-none" />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-[9px] font-black p-3 rounded-xl border border-red-100 uppercase tracking-widest animate-shake">
                        ❌ {error}
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-xl shadow-2xl transition-all transform active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-20 mt-2">
                    {loading ? "Initializing..." : "Register Identity"}
                </button>
            </form>

            <p className="mt-8 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Active ID? <span onClick={() => navigate("/login")} className="text-green-600 cursor-pointer hover:underline underline-offset-4 decoration-2">Access Portal</span>
            </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
}
