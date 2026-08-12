import { useState } from 'react';

const LeaderboardTable = ({ users, platform }: any) => {
  const [page, setPage] = useState(0);
  const PER_PAGE = 8;

  const activeUsers = users.filter((u: any) => {
    const s = u.codingProfiles?.[platform];
    return (s?.solved || s?.rating || s?.contributions) > 0;
  });

  const totalPages = Math.ceil(activeUsers.length / PER_PAGE);
  const slice = activeUsers.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[11px] font-bold text-[#444] uppercase tracking-widest">Rankings</div>
        <div className="text-[11px] text-[#333] font-medium">{activeUsers.length} Profiles</div>
      </div>

      <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        {slice.map((user: any, i: number) => {
          const rank = (page * PER_PAGE) + i;
          const score = user.codingProfiles?.[platform]?.solved || 
                        user.codingProfiles?.[platform]?.rating || 
                        user.codingProfiles?.[platform]?.contributions || 0;
          
          const isPodium = rank < 3;
          const rankColors = ["text-[#f59e0b]", "text-[#9ca3af]", "text-[#c2784e]"];
          const bgColors = ["bg-[#f59e0b18]", "bg-[#9ca3af18]", "bg-[#c2784e18]"];

          return (
            <div key={user._id} className="flex items-center px-6 py-4 border-bottom border-[#111] last:border-0 hover:bg-[#0f0f0f] transition-all">
              <div className={`w-8 text-[13px] font-extrabold font-mono ${isPodium ? rankColors[rank] : 'text-[#333]'}`}>
                {(rank + 1).toString().padStart(2, '0')}
              </div>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold mr-4 ${isPodium ? `${bgColors[rank]} ${rankColors[rank]}` : 'bg-[#1a1a1a] text-[#555]'}`}>
                {getInitials(user.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#d4d4d4] flex items-center gap-2">
                  {user.name}
                </div>
                <div className="text-[11px] text-[#333] mt-0.5">@{user.codingProfiles?.[platform]?.username || 'linked'}</div>
              </div>

              <div className="text-right">
                <div className={`text-[17px] font-extrabold font-mono ${isPodium ? 'text-[#4ade80]' : 'text-[#e8e8e8]'}`}>
                  {score.toLocaleString()}
                </div>
                <div className="text-[9px] text-[#333] font-bold uppercase tracking-widest">
                  {platform === 'github' ? 'Contributions' : platform === 'leetcode' ? 'Solved' : 'Rating'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="w-9 h-9 border border-[#1f1f1f] bg-[#0d0d0d] rounded-lg flex items-center justify-center text-[#555] hover:text-white disabled:opacity-20 transition-all"
          >
            ‹
          </button>
          
          <div className="flex gap-1.5 items-center">
            {[...Array(totalPages)].map((_, i) => (
              <div 
                key={i} 
                onClick={() => setPage(i)}
                className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${page === i ? 'w-6 bg-[#4ade80]' : 'w-1.5 bg-[#222]'}`}
              />
            ))}
          </div>

          <button 
            disabled={page === totalPages - 1} 
            onClick={() => setPage(p => p + 1)}
            className="w-9 h-9 border border-[#1f1f1f] bg-[#0d0d0d] rounded-lg flex items-center justify-center text-[#555] hover:text-white disabled:opacity-20 transition-all"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;