import { useState } from "react";

interface HeaderProps {
  onSync: () => Promise<void>;
}

export const ArenaHeader = ({ onSync }: HeaderProps) => {
  const [syncing, setSyncing] = useState(false);

  const handleSyncClick = async () => {
    if (syncing) return;
    setSyncing(true);
    await onSync();
    setSyncing(false);
  };

  return (
    <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
      <div>
        <div className="text-[13px] text-[#4ade80] font-semibold tracking-[0.18em] uppercase mb-1">
          Competitive Arena
        </div>
        <h1 className="text-[42px] font-extrabold text-[#f0f0f0] tracking-tighter leading-none">
          Arena
        </h1>
        <div className="text-[13px] text-[#555] mt-1.5 font-medium">
          Global coding stats & rankings.
        </div>
      </div>
      <button 
        onClick={handleSyncClick}
        disabled={syncing}
        className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#22c55e] text-black px-[22px] py-[11px] rounded-[12px] text-[12px] font-extrabold tracking-wider uppercase transition-all active:scale-95 disabled:opacity-70"
      >
        <span className={`w-[14px] h-[14px] border-2 border-black border-t-transparent rounded-full ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Syncing...' : 'Sync all profiles'}
      </button>
    </div>
  );
};