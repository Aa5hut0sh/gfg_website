import CIcon from '@coreui/icons-react';
import { cibLeetcode, cibGithub } from '@coreui/icons';

// Custom Codeforces bars - Ensure 'fill="currentColor"' is inside the path
const cifCodeforces = [
  '32 32',
  '<path fill="currentColor" d="M24 12h8v20h-8zM12 4h8v28h-8zM0 20h8v12H0z"/>'
];

export const PlatformTabs = ({ active, onChange }: any) => {
  const tabs = [
    { id: "leetcode", label: "LeetCode", icon: cibLeetcode },
    { id: "codeforces", label: "Codeforces", icon: cifCodeforces },
    { id: "github", label: "GitHub", icon: cibGithub },
  ];

  return (
    <div className="flex justify-center mb-10">
      <div className="flex bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-1 gap-0.5">
        {tabs.map((t) => {
          const isActive = active === t.id;
          
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl 
                text-[11px] font-bold uppercase tracking-widest 
                transition-all duration-200
                ${isActive 
                  ? "bg-[#16a34a] text-black shadow-[0_0_20px_rgba(22,163,74,0.2)]" 
                  : "text-[#555] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]"
                }
              `}
            >
              <CIcon 
                icon={t.icon} 
                className="w-4 h-4 transition-colors duration-200" 
                // This "fill" style is the secret sauce to override internal SVG colors
                style={{ fill: 'currentColor' }} 
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};