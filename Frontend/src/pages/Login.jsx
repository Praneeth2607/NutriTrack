import { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../services/authStorage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      saveAuth(response.token, response.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.data?.message || "Invalid Link. Retry.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden animate-fade-in">
      
      {/* Background Asset */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <img src="/dashboard_hero_bg_1774790398014.png" className="w-full h-full object-cover blur-[60px]" alt="" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/60 p-8 md:p-10 text-center">
            
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-[1.5rem] shadow-2xl shadow-green-200 rotate-6 hover:rotate-0 transition-transform duration-500">
                <span className="text-3xl">🥗</span>
            </div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">NutriTrack</h1>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Neural Health Link</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Access Key (Email)</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="identity@neural.com"
                        className="w-full bg-gray-50 border-none rounded-xl p-4 font-black text-gray-700 focus:ring-8 focus:ring-green-500/5 transition-all outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Security Hash</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-none rounded-xl p-4 font-black text-gray-700 focus:ring-8 focus:ring-green-500/5 transition-all outline-none"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-[9px] font-black p-3 rounded-xl border border-red-100 uppercase tracking-widest animate-shake">
                        ❌ {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-2xl transition-all transform hover:scale-[1.01] active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-20 mt-2"
                >
                    {loading ? "Authenticating..." : "Establish Connection"}
                </button>
            </form>

            <p className="mt-8 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                New User? <span onClick={() => navigate("/register")} className="text-green-600 cursor-pointer hover:underline underline-offset-4 decoration-2">Join Network</span>
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
