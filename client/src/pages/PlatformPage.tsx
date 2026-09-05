import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PlatformTabs } from "../components/PlatformTabs";
import { ProfileStatsCard } from "../components/ProfileStatsCard";
import LeaderboardTable from "../components/LeaderboardTable";
import AdminProfilesView from "../components/AdminCodingProfiles";
import {
  getProfiles,
  getLeaderboard,
  syncProfiles,
  addLeetCodeProfile,
  addCodeforcesProfile,
  addGithubProfile,
  removeProfile,
  getAllUsersProfiles, // you'll need this admin endpoint
} from "../services/user.service";
import { PlatformType, LeaderboardUser } from "../types/codingProfiles.types";
import { toast } from "react-hot-toast";
import { RefreshCw, X, AlertTriangle, Lock } from "lucide-react";
import { useAuth } from "../auth/authContext";

const ProfilesPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const platformQuery = searchParams.get("platform") as PlatformType;
  const activePlatform = platformQuery || "leetcode";

  const [myProfiles, setMyProfiles] = useState<any>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [allUsersData, setAllUsersData] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [handleInput, setHandleInput] = useState("");

  const handlePlatformChange = (p: PlatformType) => {
    setSearchParams({ platform: p });
  };

  const loadData = async () => {
    try {
      if (user?.role === "ADMIN") {
        const res = await getAllUsersProfiles();
        setAllUsersData(res.users || []);
      } else if (user) {
        const [profRes, leadRes] = await Promise.all([
          getProfiles(),
          getLeaderboard(activePlatform),
        ]);
        setMyProfiles(profRes.codingProfiles || {});
        setLeaderboard(leadRes.users || []);
      } else {
        // logged out — still load leaderboard for display
        const leadRes = await getLeaderboard(activePlatform);
        setLeaderboard(leadRes.users || []);
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [activePlatform, user]);

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    const tid = toast.loading("Syncing all platforms...");
    try {
      await syncProfiles();
      await loadData();
      toast.success("All profiles synced!", { id: tid });
    } catch {
      toast.error("Sync failed", { id: tid });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnect = async () => {
    if (!handleInput.trim()) return toast.error("Enter a handle");
    const tid = toast.loading(`Connecting ${activePlatform}...`);
    try {
      if (activePlatform === "leetcode") await addLeetCodeProfile(handleInput);
      if (activePlatform === "codeforces") await addCodeforcesProfile(handleInput);
      if (activePlatform === "github") await addGithubProfile(handleInput);
      toast.success(`${activePlatform} connected!`, { id: tid });
      setHandleInput("");
      setShowModal(false);
      await loadData();
    } catch {
      toast.error("User not found", { id: tid });
    }
  };

  const handleRemoveConfirm = async () => {
    const tid = toast.loading(`Disconnecting ${activePlatform}...`);
    try {
      await removeProfile(activePlatform);
      toast.success("Profile removed", { id: tid });
      setShowDeleteModal(false);
      await loadData();
    } catch {
      toast.error("Failed to remove", { id: tid });
    }
  };

  // ── ADMIN VIEW ──────────────────────────────────────────────
  if (user?.role === "ADMIN") {
    return <AdminProfilesView users={allUsersData} />
  }

  // ── MAIN VIEW (logged in user + logged out) ──────────────────
  return (
    <div
      className="min-h-screen text-[#f0f0f0] selection:bg-green-500/30"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <div className="relative mt-10 max-w-[900px] mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-6">
          <div>
            <h1 className="text-[42px] font-extrabold tracking-[-2px] leading-none">
              CodeFolio
            </h1>
            <p className="text-[13px] text-[#555] mt-1 font-medium">
              Global coding stats & rankings.
            </p>
          </div>
          {user && (
            <button
              onClick={handleGlobalSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#22c55e] text-black px-5 py-2.5 rounded-xl text-[12px] font-extrabold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : "Sync all profiles"}
            </button>
          )}
        </div>

        <PlatformTabs active={activePlatform} onChange={handlePlatformChange} />

        <ProfileStatsCard
          platform={activePlatform}
          data={user ? myProfiles?.[activePlatform] : undefined}
          isLoggedIn={!!user}
          onAdd={() => setShowModal(true)}
          onRemove={() => setShowDeleteModal(true)}
        />

        <LeaderboardTable users={leaderboard} platform={activePlatform} />
      </div>

      {/* CONNECT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#0b0b0b] border border-[#1e1e1e] rounded-2xl p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-extrabold mb-6 uppercase tracking-tight">
              Connect {activePlatform}
            </h2>
            <input
              autoFocus
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-5 py-3.5 text-white outline-none mb-4 focus:border-[#4ade80] transition-all"
              placeholder="Enter handle..."
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />
            <button
              onClick={handleConnect}
              className="w-full bg-[#16a34a] text-black py-3.5 rounded-xl font-extrabold uppercase tracking-widest hover:bg-[#22c55e] transition-all active:scale-95"
            >
              Connect Profile
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0b0b0b] border border-[#2a1a1a] rounded-2xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[#f87171] bg-[#f8717115] w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto border border-[#f8717130]">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-center text-white mb-2 uppercase tracking-tight">
              Disconnect {activePlatform}?
            </h2>
            <p className="text-[#555] text-center text-sm mb-8 leading-relaxed">
              Your stats will be removed from the leaderboard. You can re-connect your handle at any time.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRemoveConfirm}
                className="w-full bg-[#1a0f0f] border border-[#2a1a1a] text-[#f87171] py-3.5 rounded-xl font-extrabold uppercase tracking-widest hover:bg-[#2a1010] transition-all active:scale-95"
              >
                Yes, Disconnect
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-transparent text-[#555] py-3 rounded-xl font-bold uppercase tracking-widest hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;