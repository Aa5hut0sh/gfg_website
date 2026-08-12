import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CIcon from "@coreui/icons-react";
import { cibLeetcode, cibGithub } from "@coreui/icons";

const cifCodeforces = [
  "32 32",
  '<path fill="currentColor" d="M24 12h8v20h-8zM12 4h8v28h-8zM0 20h8v12H0z"/>',
];

const PLATFORM_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; bg: string; statKey: string }
> = {
  leetcode: {
    label: "LeetCode",
    icon: cibLeetcode,
    color: "#f59e0b",
    bg: "#f59e0b18",
    statKey: "solved",
  },
  codeforces: {
    label: "Codeforces",
    icon: cifCodeforces,
    color: "#60a5fa",
    bg: "#60a5fa18",
    statKey: "rating",
  },
  github: {
    label: "GitHub",
    icon: cibGithub,
    color: "#a78bfa",
    bg: "#a78bfa18",
    statKey: "contributions",
  },
};

const STAT_LABELS: Record<string, string> = {
  solved: "Solved",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  ranking: "Ranking",
  rating: "Rating",
  maxRating: "Max Rating",
  rank: "Rank",
  maxRank: "Max Rank",
  contests: "Contests",
  totalSubmissions: "Submissions",
  repos: "Repos",
  followers: "Followers",
  stars: "Stars",
  contributions: "Contributions",
};

const getInitials = (name: string) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

const PlatformBadge = ({ platform, data }: { platform: string; data: any }) => {
  const cfg = PLATFORM_CONFIG[platform];
  if (!cfg || !data) return null;
  const handle = data.username || data.handle;
  const mainStat = data[cfg.statKey];

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}22`,
      }}
    >
      <CIcon icon={cfg.icon} className="w-3 h-3" style={{ fill: cfg.color }} />
      <span>@{handle}</span>
      {mainStat !== undefined && (
        <span className="ml-1 opacity-70">· {mainStat.toLocaleString()}</span>
      )}
    </div>
  );
};

const PlatformStatsPanel = ({
  platform,
  data,
}: {
  platform: string;
  data: any;
}) => {
  const cfg = PLATFORM_CONFIG[platform];
  if (!cfg || !data) return null;

  const filteredStats = Object.entries(data).filter(
    ([k]) => !["username", "handle", "lastUpdated", "_id"].includes(k),
  );

  return (
    <div className="rounded-xl overflow-hidden border border-[#1a1a1a]">
      {/* Platform header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: cfg.bg, borderBottom: `1px solid ${cfg.color}22` }}
      >
        <CIcon
          icon={cfg.icon}
          className="w-3.5 h-3.5"
          style={{ fill: cfg.color }}
        />
        <span
          className="text-[11px] font-extrabold uppercase tracking-widest"
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
        <span
          className="ml-auto text-[11px] font-semibold"
          style={{ color: cfg.color, opacity: 0.6 }}
        >
          @{data.username || data.handle}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-[1px] bg-[#1a1a1a]">
        {filteredStats.map(([key, val]: any, idx) => (
          <div key={key} className="bg-[#0f0f0f] px-4 py-3">
            <div className="text-[9px] text-[#444] font-bold uppercase tracking-widest mb-1">
              {STAT_LABELS[key] || key}
            </div>
            <div
              className="text-[16px] font-extrabold"
              style={{ color: idx === 0 ? cfg.color : "#e8e8e8" }}
            >
              {typeof val === "number" ? val.toLocaleString() : val || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminUserCard = ({ u }: { u: any }) => {
  const [open, setOpen] = useState(false);

  const profiles = u.codingProfiles || {};
  const connectedPlatforms = Object.keys(PLATFORM_CONFIG).filter(
    (p) => profiles[p] && (profiles[p].username || profiles[p].handle),
  );
  const totalConnected = connectedPlatforms.length;

  return (
    <div className="bg-[#0b0b0b] border border-[#1e1e1e] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#2a2a2a]">
      {/* ── Collapsed bar ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[12px] font-extrabold text-[#4ade80] shrink-0">
          {getInitials(u.name)}
        </div>

        {/* Name + email */}
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-white truncate">
            {u.name}
          </div>
          <div className="text-[11px] text-[#444] truncate">{u.email}</div>
        </div>

        {/* Platform badges */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {connectedPlatforms.length === 0 ? (
            <span className="text-[11px] text-[#333] font-medium">
              No profiles
            </span>
          ) : (
            connectedPlatforms.map((p) => (
              <PlatformBadge key={p} platform={p} data={profiles[p]} />
            ))
          )}
        </div>

        {/* Connected count pill */}
        <div className="shrink-0 flex items-center gap-2 ml-2">
          <span className="text-[10px] font-bold text-[#333] bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded-md">
            {totalConnected}/3
          </span>
          {open ? (
            <ChevronUp size={14} className="text-[#444]" />
          ) : (
            <ChevronDown size={14} className="text-[#444]" />
          )}
        </div>
      </button>

      {/* ── Expanded stats ── */}
      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-[#111] pt-4">
          {connectedPlatforms.length === 0 ? (
            <p className="text-[12px] text-[#333] italic">
              No coding profiles linked.
            </p>
          ) : (
            connectedPlatforms.map((p) => (
              <PlatformStatsPanel key={p} platform={p} data={profiles[p]} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AdminProfilesView = ({ users }: { users: any[] }) => {
  const usersWithProfiles = users.filter((u) =>
    Object.keys(PLATFORM_CONFIG).some(
      (p) => u.codingProfiles?.[p]?.username || u.codingProfiles?.[p]?.handle,
    ),
  );

  const totalConnected = usersWithProfiles.length;
  return (
    <div
      className="min-h-screen text-[#f0f0f0]"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <div className="max-w-[900px] mx-auto px-6 py-12 mt-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[42px] font-extrabold tracking-[-2px] leading-none">
            CodeFolio
          </h1>
          <p className="text-[13px] text-[#555] mt-1 font-medium">
            Admin · {users.length} members · {totalConnected} with profiles
          </p>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 flex-wrap mb-8">
          {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => {
            const count = users.filter(
              (u) =>
                u.codingProfiles?.[key]?.username ||
                u.codingProfiles?.[key]?.handle,
            ).length;
            return (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold"
                style={{
                  background: cfg.bg,
                  color: cfg.color,
                  border: `1px solid ${cfg.color}22`,
                }}
              >
                <CIcon
                  icon={cfg.icon}
                  className="w-3 h-3"
                  style={{ fill: cfg.color }}
                />
                {cfg.label} · {count} linked
              </div>
            );
          })}
        </div>

        {/* User cards */}
        <div className="space-y-3">
          {usersWithProfiles.length === 0 ? (
            <p className="text-[#444] text-sm">
              No users with linked profiles.
            </p>
          ) : (
            usersWithProfiles.map((u) => <AdminUserCard key={u._id} u={u} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilesView;
