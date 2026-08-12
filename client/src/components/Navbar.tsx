import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "EVENTS", path: "/events" },
    { name: "CODEFOLIO", path: "/codefolio" },
    { name: "TEAM", path: "/team" },
    { name: "RESOURCES", path: "/resources" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-[64px]  backdrop-blur-md border border-green-500/20 rounded-2xl z-50 shadow-2xl shadow-green-900/10">
      <div className="h-full w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:shadow-green-500/60 transition-all overflow-hidden">
            <img src={logo} alt="GFG RGIPT" className="w-full h-full object-cover" />
          </div>
          <span className="text-white text-md font-bold tracking-tight group-hover:text-green-400 transition-colors">
            GFG RGIPT
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-400 hover:text-green-400 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-green-500 hover:after:w-full after:transition-all"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div
              className="relative py-2 hidden md:block"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-semibold hover:bg-green-500/20 transition-all">
                {user.name}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Fixed Dropdown: Positioned to avoid gaps so hover doesn't break */}
              {showUserDropdown && (
                <div className="absolute top-full right-0 w-40 pt-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"  state={{ from: location.pathname + location.search }} className="text-gray-400 hover:text-white text-xs font-bold px-4 transition-colors">
                Login
              </Link>
              <Link to="/signup" state={{ from: location.pathname + location.search }}>
                <button className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-green-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-[74px] left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:hidden animate-in slide-in-from-top-5 duration-300 shadow-2xl">
          <nav className="flex flex-col gap-6 mb-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-lg font-semibold text-gray-300 hover:text-green-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 border-t border-white/10">
            {user ? (
              <div className="flex flex-col gap-4">
                <span className="text-sm text-green-400 font-semibold">Logged in as {user.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 text-red-400 font-bold"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" state={{ from: location.pathname + location.search }} className="text-gray-300 font-bold">Login</Link>
                <Link to="/signup" state={{ from: location.pathname + location.search }}  className="w-full">
                  <button className="w-full bg-green-600 py-3 rounded-xl font-bold text-black">Sign Up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;