import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../services/authStorage";

export default function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="text-xl font-bold tracking-wider">NutriTrack</Link>
      <div className="flex gap-6 items-center font-medium">
        <Link to="/dashboard" className="hover:text-green-200 transition-colors">Dashboard</Link>
        <Link to="/profile" className="hover:text-green-200 transition-colors">Profile</Link>
        <Link to="/chat" className="hover:text-green-200 transition-colors">Chat Assistant</Link>
        <button onClick={handleLogout} className="bg-white text-green-600 px-4 py-1 rounded shadow hover:bg-gray-100 transition-colors">
          Logout
        </button>
      </div>
    </nav>
  );
}
