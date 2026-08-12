import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <header className="w-full h-[72px] bg-black/80 backdrop-blur-xl border-b border-green-500/30">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)]">
            <span className="text-green-400 font-bold text-sm">GFG</span>
          </div>
          <span className="text-green-400 text-lg font-bold tracking-wide">
            GFG RGIPT
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link to="/about" className="text-gray-300 hover:text-green-400">Ab</Link>
          <Link to="/contact" className="text-gray-300 hover:text-green-400">Contact</Link>
          <Link to="/events" className="text-gray-300 hover:text-green-400">Events</Link>
          <Link to="/members" className="text-gray-300 hover:text-green-400">Members</Link>
        </nav>

        {/* User */}
        {user && (
          <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-sm text-green-400">
            {user.name}
          </div>
        )}
      </div>
    </header>
  );
};

export default Dashboard;
