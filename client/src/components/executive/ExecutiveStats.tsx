import type { ReactNode } from "react";

export interface ExecutiveStatsProps {
  totalExecutives: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

type StatTone = "default" | "pending" | "progress" | "success" | "attention";

interface StatCardConfig {
  key: string;
  label: string;
  value: number;
  tone: StatTone;
  icon: ReactNode;
  caption?: string;
}

const toneStyles: Record<
  StatTone,
  { card: string; iconWrap: string; value: string; label: string }
> = {
  default: {
    card: "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
    iconWrap: "bg-white/10 text-gray-200",
    value: "text-white",
    label: "text-gray-400",
  },
  pending: {
    card: "border-white/10 bg-white/[0.03] hover:border-amber-400/30 hover:bg-white/[0.05]",
    iconWrap: "bg-amber-500/10 text-amber-300",
    value: "text-white",
    label: "text-gray-400",
  },
  progress: {
    card: "border-white/10 bg-white/[0.03] hover:border-sky-400/30 hover:bg-white/[0.05]",
    iconWrap: "bg-sky-500/10 text-sky-300",
    value: "text-white",
    label: "text-gray-400",
  },
  success: {
    card: "border-white/10 bg-white/[0.03] hover:border-emerald-400/30 hover:bg-white/[0.05]",
    iconWrap: "bg-emerald-500/10 text-emerald-300",
    value: "text-white",
    label: "text-gray-400",
  },
  attention: {
    card: "border-rose-500/30 bg-rose-500/[0.06] hover:border-rose-400/50 hover:bg-rose-500/[0.09]",
    iconWrap: "bg-rose-500/15 text-rose-300",
    value: "text-rose-100",
    label: "text-rose-200/80",
  },
};

const iconClass = "h-5 w-5";

const UsersIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClipboardIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
);

const ClockIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const ProgressIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v6h-6" />
  </svg>
);

const CheckIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4 12 14.01l-3-3" />
  </svg>
);

const AlertIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const formatNumber = (value: number): string =>
  Number.isFinite(value) ? value.toLocaleString() : "0";

const ExecutiveStats = ({
  totalExecutives,
  totalTasks,
  pendingTasks,
  inProgressTasks,
  completedTasks,
  overdueTasks,
}: ExecutiveStatsProps) => {
  const cards: StatCardConfig[] = [
    {
      key: "total-executives",
      label: "Total Executives",
      value: totalExecutives,
      tone: "default",
      icon: UsersIcon,
    },
    {
      key: "total-tasks",
      label: "Total Tasks",
      value: totalTasks,
      tone: "default",
      icon: ClipboardIcon,
    },
    {
      key: "pending-tasks",
      label: "Pending Tasks",
      value: pendingTasks,
      tone: "pending",
      icon: ClockIcon,
    },
    {
      key: "in-progress-tasks",
      label: "In Progress",
      value: inProgressTasks,
      tone: "progress",
      icon: ProgressIcon,
    },
    {
      key: "completed-tasks",
      label: "Completed",
      value: completedTasks,
      tone: "success",
      icon: CheckIcon,
    },
    {
      key: "overdue-tasks",
      label: "Overdue",
      value: overdueTasks,
      tone: "attention",
      icon: AlertIcon,
      caption: overdueTasks > 0 ? "Needs attention" : "All on schedule",
    },
  ];

  return (
    <section aria-label="Executive statistics">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const styles = toneStyles[card.tone];
          const needsAttention = card.tone === "attention" && card.value > 0;

          return (
            <li
              key={card.key}
              className={`group rounded-2xl border p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${styles.card}`}
            >
              <article className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3
                    className={`text-sm font-medium tracking-wide ${styles.label}`}
                  >
                    {card.label}
                  </h3>
                  <p
                    className={`mt-2 text-4xl font-bold tabular-nums leading-none ${styles.value}`}
                  >
                    {formatNumber(card.value)}
                  </p>
                  {card.caption ? (
                    <p
                      className={`mt-3 text-xs font-medium ${
                        needsAttention ? "text-rose-300/90" : "text-gray-500"
                      }`}
                    >
                      {card.caption}
                    </p>
                  ) : null}
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${styles.iconWrap}`}
                >
                  {card.icon}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ExecutiveStats;