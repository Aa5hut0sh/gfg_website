export type TaskCardStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface TaskCardTask {
  id: string;
  title: string;
  description?: string | null;
  assignedTo: string;
  assignedBy: string;
  status: TaskCardStatus;
  dueDate: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCardProps {
  task: TaskCardTask;
  onStatusChange?: (taskId: string, status: TaskCardStatus) => void;
  onDelete?: (taskId: string) => void;
}

interface StatusConfig {
  label: string;
  hint: string;
  badge: string;
  dot: string;
}

const statusConfig: Record<TaskCardStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    hint: "Not started yet",
    badge: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    hint: "Currently being worked on",
    badge: "border-sky-400/30 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
  },
  COMPLETED: {
    label: "Completed",
    hint: "Task completed",
    badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;

  // Date-only strings are treated as local calendar dates to avoid
  // timezone shifts when displaying them.
  if (DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const local = new Date(year, month - 1, day);
    return Number.isNaN(local.getTime()) ? null : local;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value: string | null | undefined): string => {
  const date = parseDate(value);
  if (!date) return "Not available";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isPastDue = (dueDate: string): boolean => {
  const due = parseDate(dueDate);
  if (!due) return false;

  // A date-only due date stays valid until the end of that day.
  if (DATE_ONLY_PATTERN.test(dueDate)) {
    const endOfDay = new Date(due);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime() < Date.now();
  }

  return due.getTime() < Date.now();
};

const TaskCard = ({ task, onStatusChange, onDelete }: TaskCardProps) => {
  const {
    id,
    title,
    description,
    assignedTo,
    assignedBy,
    status,
    dueDate,
    completedAt,
  } = task;

  const config = statusConfig[status];
  const isCompleted = status === "COMPLETED";
  const isOverdue = !isCompleted && isPastDue(dueDate);
  const trimmedDescription = description?.trim() ?? "";

  const nextStatus: TaskCardStatus | null =
    status === "PENDING"
      ? "IN_PROGRESS"
      : status === "IN_PROGRESS"
        ? "COMPLETED"
        : null;

  const nextActionLabel =
    nextStatus === "IN_PROGRESS"
      ? "Start Task"
      : nextStatus === "COMPLETED"
        ? "Mark Completed"
        : "";

  const showStatusAction = Boolean(onStatusChange && nextStatus);
  const showDelete = Boolean(onDelete);
  const showActions = showStatusAction || showDelete;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${
        isOverdue
          ? "border-rose-500/30 bg-rose-500/[0.05] hover:border-rose-400/50"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="min-w-0 break-words text-lg font-semibold leading-snug text-white">
          {title}
        </h3>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${config.badge}`}
          title={config.hint}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
            aria-hidden="true"
          />
          {config.label}
        </span>
      </header>

      <p className="mt-1 text-xs text-gray-500">{config.hint}</p>

      {trimmedDescription ? (
        <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-gray-300">
          {trimmedDescription}
        </p>
      ) : (
        <p className="mt-3 text-sm italic text-gray-500">
          No description provided.
        </p>
      )}

      <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Due Date
          </dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <time
              dateTime={dueDate}
              className={`font-semibold ${
                isOverdue ? "text-rose-200" : "text-gray-100"
              }`}
            >
              {formatDate(dueDate)}
            </time>
            {isOverdue ? (
              <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
                Overdue
              </span>
            ) : null}
          </dd>
        </div>

        {isCompleted ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Completed On
            </dt>
            <dd className="mt-1 font-semibold text-emerald-300">
              {completedAt ? (
                <time dateTime={completedAt}>{formatDate(completedAt)}</time>
              ) : (
                "Date not recorded"
              )}
            </dd>
          </div>
        ) : null}

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Assigned To
          </dt>
          <dd className="mt-1 break-words text-gray-200">{assignedTo}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Assigned By
          </dt>
          <dd className="mt-1 break-words text-gray-200">{assignedBy}</dd>
        </div>
      </dl>

      {showActions ? (
        <footer className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          {showStatusAction && nextStatus && onStatusChange ? (
            <button
              type="button"
              onClick={() => onStatusChange(id, nextStatus)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${
                nextStatus === "COMPLETED"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 focus-visible:ring-emerald-400/50"
                  : "border-sky-400/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 focus-visible:ring-sky-400/50"
              }`}
            >
              {nextActionLabel}
            </button>
          ) : null}

          {showDelete && onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 sm:ml-auto"
            >
              Delete
            </button>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
};

export default TaskCard;