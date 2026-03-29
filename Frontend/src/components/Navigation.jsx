import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearAuth } from "../services/authStorage";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/chat", label: "Assistant", icon: "🤖" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 animate-fade-in">
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-2 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center justify-between">
        
        <div className="flex items-center gap-4 pl-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-green-200">
                🥗
            </div>
            <div className="hidden sm:block">
                <h1 className="text-lg font-black text-gray-900 tracking-tighter leading-none">NutriTrack</h1>
                <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Premium Edition</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                            isActive 
                            ? "bg-gray-900 text-white shadow-xl scale-105" 
                            : "text-gray-400 hover:text-gray-900 hover:bg-gray-100/50"
                        }`}
                    >
                        <span>{item.icon}</span>
                        <span className="hidden md:block">{item.label}</span>
                    </Link>
                );
            })}
            
            <div className="w-px h-6 bg-gray-100 mx-2 hidden sm:block"></div>

            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold shadow-inner"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
        </div>
      </div>
    </nav>
  );
}
