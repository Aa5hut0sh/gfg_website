import { useAuth } from "../auth/authContext";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import TeamMemberList from "./Team";

const TeamContent = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <p className="text-green-500 text-xs font-black uppercase tracking-[0.4em] mb-4">
            GFG RGIPT
          </p>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            Meet Our Core Team
          </h1>

          <p className="text-gray-500 mt-4 text-base">
            Nothing great is made alone.
          </p>
        </div>

        {/* ADMIN ONLY */}
        {user?.role === "ADMIN" && (
          <Link
            to="/team/admin"
            className="self-start md:self-auto bg-green-600 hover:bg-green-500 text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
          >
            <Settings size={18} />
            MANAGE TEAM
          </Link>
        )}
      </div>

      {/* Team Members */}
      <TeamMemberList />
    </div>
  );
};

export default TeamContent;