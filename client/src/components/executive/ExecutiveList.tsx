export interface Executive {
  id: string;
  name?: string | null;
  email: string;
  role: "EXECUTIVE";
}

export interface ExecutiveListProps {
  executives: Executive[];
  onDemote?: (userId: string) => void;
}

const getDisplayName = (executive: Executive): string => {
  const trimmed = executive.name?.trim();
  return trimmed ? trimmed : "Unnamed executive";
};

const getInitial = (executive: Executive): string => {
  const source = executive.name?.trim() || executive.email.trim();
  return source ? source.charAt(0).toUpperCase() : "?";
};

const ExecutiveList = ({ executives, onDemote }: ExecutiveListProps) => {
  if (executives.length === 0) {
    return (
      <section
        aria-label="Executive list"
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center"
      >
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gray-400"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-200">
          No executives found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          There are no executives to display right now.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Executive list">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {executives.map((executive) => {
          const displayName = getDisplayName(executive);
          const hasName = Boolean(executive.name?.trim());

          return (
            <li key={executive.id} className="min-w-0">
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-black/20">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base font-semibold text-gray-100"
                    aria-hidden="true"
                  >
                    {getInitial(executive)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`truncate text-lg font-semibold leading-snug ${
                        hasName ? "text-white" : "italic text-gray-400"
                      }`}
                      title={displayName}
                    >
                      {displayName}
                    </h3>
                    <p
                      className="mt-0.5 truncate text-sm text-gray-400"
                      title={executive.email}
                    >
                      {executive.email}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      aria-hidden="true"
                    />
                    {executive.role}
                  </span>
                </div>

                {onDemote ? (
                  <div className="mt-auto flex items-center border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => onDemote(executive.id)}
                      aria-label={`Demote ${displayName}`}
                      className="rounded-lg border border-rose-400/25 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition-colors hover:border-rose-400/40 hover:bg-rose-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 sm:ml-auto"
                    >
                      Demote
                    </button>
                  </div>
                ) : null}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ExecutiveList;