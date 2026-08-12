import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useLocation } from "react-router-dom";

export const ProfileStatsCard = ({ platform, data, isLoggedIn, onAdd, onRemove }: any) => {
  const isConnected = data && (data.username || data.handle);
const location = useLocation();
  if (!isConnected) {
    // ── Logged out: show login prompt ──
    if (!isLoggedIn) {
      return (
        <div className="border border-[#1e1e1e] rounded-[18px] bg-[#0b0b0b] p-12 text-center mb-8">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
            <Lock className="text-green-500 w-5 h-5" />
          </div>
          <div className="text-[13px] font-semibold text-[#444] mb-1">
            Login to connect your {platform} profile
          </div>
          <div className="text-[12px] text-[#333] mb-6">
            Sign in to link your account and appear on the leaderboard
          </div>
          <Link
            to="/login" state={{ from: location.pathname + location.search }}
            className="inline-block bg-[#16a34a] hover:bg-[#22c55e] text-black px-6 py-2.5 rounded-xl text-[12px] font-extrabold uppercase tracking-widest transition-all"
          >
            Login to Connect
          </Link>
        </div>
      );
    }

    // ── Logged in but not connected ──
    return (
      <div className="border border-[#1e1e1e] rounded-[18px] bg-[#0b0b0b] p-12 text-center mb-8">
        <div className="text-3xl mb-3 opacity-20">+</div>
        <div className="text-[13px] font-semibold text-[#444] mb-1">
          No {platform} profile linked
        </div>
        <div className="text-[12px] text-[#333] mb-6">
          Connect your account to appear on the leaderboard
        </div>
        <button
          onClick={onAdd}
          className="bg-[#16a34a] hover:bg-[#22c55e] text-black px-6 py-2.5 rounded-xl text-[12px] font-extrabold uppercase tracking-widest transition-all"
        >
          + Connect {platform}
        </button>
      </div>
    );
  }

  const getLabel = (key: string) => {
    if (key === "solved") return "Solved";
    if (key === "rating") return "Rating";
    if (key === "rank") return platform === "codeforces" ? "Rank" : "Global Rank";
    if (key === "stars") return "Stars";
    return key;
  };

  const filteredStats = Object.entries(data).filter(
    ([k]) => !["username", "handle", "lastUpdated", "_id"].includes(k)
  );

  return (
    <div className="border border-[#1e1e1e] rounded-[18px] bg-[#0b0b0b] p-7 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#16a34a44] to-transparent" />

      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#aaa] font-bold uppercase tracking-widest">
            {platform}
          </span>
        </div>
        <span className="text-[12px] text-[#16a34a] bg-[#16a34a15] border border-[#16a34a30] px-2.5 py-1 rounded-md font-semibold">
          @{data.username || data.handle}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-[1px] bg-[#1a1a1a] rounded-xl overflow-hidden">
        {filteredStats.map(([key, val]: any, idx) => (
          <div key={key} className="bg-[#0f0f0f] p-5">
            <div className="text-[10px] text-[#444] font-bold uppercase tracking-widest mb-1.5">
              {getLabel(key)}
            </div>
            <div className={`text-[22px] font-extrabold ${idx === 0 ? "text-[#4ade80]" : "text-[#e8e8e8]"}`}>
              {typeof val === "number" ? val.toLocaleString() : val}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onRemove}
        className="w-full mt-5 py-2.5 border border-[#2a1a1a] bg-[#1a0f0f] text-[#f87171] rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#2a1010] transition-all"
      >
        Disconnect Profile
      </button>
    </div>
  );
};