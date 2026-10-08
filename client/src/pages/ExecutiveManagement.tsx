import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExecutiveStats from "../components/executive/ExecutiveStats";
import type { ExecutiveStatsProps } from "../components/executive/ExecutiveStats";
import ExecutiveList from "../components/executive/ExecutiveList";
import type { Executive } from "../components/executive/ExecutiveList";
import TaskList from "../components/executive/TaskList";
import type { TaskCardTask } from "../components/executive/TaskCard";
import AssignTaskModal from "../components/executive/AssignTaskModal";
import type {
  CreateTaskInput,
  ExecutiveOption,
} from "../components/executive/AssignTaskModal";
import {
  assignTask,
  deleteTask,
  getExecutiveDashboard,
  updateTaskStatus,
  updateUserRole,
} from "../services/executive.service";
import { getUserRefId, isPopulatedUser } from "../types/executive.types";
import type {
  AssignTaskData,
  ExecutiveUser,
  ExecutiveWithTasks,
  Task,
  TaskStatus,
  TaskSummary,
  UpdateTaskStatusData,
  UpdateUserRoleData,
  UserRef,
} from "../types/executive.types";

/* -------------------------------------------------------------------------- */
/*                                Local types                                 */
/* -------------------------------------------------------------------------- */

type MutationKind = "assign" | "demote" | "delete" | "status";

interface Notice {
  type: "success" | "error";
  message: string;
}

interface ConfirmState {
  kind: "demote" | "delete";
  id: string;
  label: string;
}

interface DashboardViewModel {
  executives: Executive[];
  tasks: TaskCardTask[];
  stats: ExecutiveStatsProps;
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isRecord(error)) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const serverMessage = response?.data?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) {
      return serverMessage;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

const getUserLabel = (user: ExecutiveUser): string =>
  user.name?.trim() || user.email?.trim() || "Executive";

const describeUserRef = (
  ref: UserRef,
  labelById: Map<string, string>,
): string | null => {
  if (isPopulatedUser(ref)) {
    const populatedLabel = ref.name?.trim() || ref.email?.trim();
    if (populatedLabel) return populatedLabel;
  }
  return labelById.get(getUserRefId(ref)) ?? null;
};

const toTaskCardTask = (
  task: Task,
  owner: ExecutiveUser,
  labelById: Map<string, string>,
): TaskCardTask => ({
  id: task._id,
  title: task.title,
  description: task.description,
  assignedTo: describeUserRef(task.assignedTo, labelById) ?? getUserLabel(owner),
  assignedBy: describeUserRef(task.assignedBy, labelById) ?? "Admin",
  status: task.status,
  // `dueDate` is optional in the backend; TaskCard shows "Not available"
  // for an empty value.
  dueDate: task.dueDate ?? "",
  completedAt: task.completedAt,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const toTime = (value: string): number => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

// Open tasks first (soonest due date on top), completed tasks afterwards.
const compareTasks = (a: TaskCardTask, b: TaskCardTask): number => {
  const rankA = a.status === "COMPLETED" ? 1 : 0;
  const rankB = b.status === "COMPLETED" ? 1 : 0;
  if (rankA !== rankB) return rankA - rankB;

  const timeA = toTime(a.dueDate);
  const timeB = toTime(b.dueDate);
  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
};

const sumSummary = (
  entries: ExecutiveWithTasks[],
  key: keyof TaskSummary,
): number =>
  entries.reduce((total, entry) => total + entry.summary[key], 0);

const buildViewModel = (entries: ExecutiveWithTasks[]): DashboardViewModel => {
  const labelById = new Map<string, string>();
  const executiveMap = new Map<string, Executive>();

  for (const entry of entries) {
    const user = entry.executive;
    labelById.set(user._id, getUserLabel(user));

    if (user.role === "EXECUTIVE" && !executiveMap.has(user._id)) {
      executiveMap.set(user._id, {
        id: user._id,
        name: user.name ?? null,
        email: user.email ?? "Email not available",
        role: "EXECUTIVE",
      });
    }
  }

  const tasks: TaskCardTask[] = [];
  for (const entry of entries) {
    for (const task of entry.tasks) {
      tasks.push(toTaskCardTask(task, entry.executive, labelById));
    }
  }
  tasks.sort(compareTasks);

  const executives = Array.from(executiveMap.values());

  return {
    executives,
    tasks,
    stats: {
      totalExecutives: executives.length,
      totalTasks: sumSummary(entries, "total"),
      pendingTasks: sumSummary(entries, "pending"),
      inProgressTasks: sumSummary(entries, "inProgress"),
      completedTasks: sumSummary(entries, "completed"),
      overdueTasks: sumSummary(entries, "overdue"),
    },
  };
};

const busyClass = (isBusy: boolean): string =>
  isBusy
    ? "pointer-events-none opacity-60 transition-opacity"
    : "transition-opacity";

/* -------------------------------------------------------------------------- */
/*                            Small local components                          */
/* -------------------------------------------------------------------------- */

interface SectionHeadingProps {
  id: string;
  title: string;
  description: string;
  count: number;
}

const SectionHeading = ({
  id,
  title,
  description,
  count,
}: SectionHeadingProps) => (
  <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
    <div>
      <div className="flex items-center gap-3">
        <h2 id={id} className="text-xl font-semibold text-white">
          {title}
        </h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-gray-300">
          {count}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const Spinner = () => (
  <svg
    className="h-8 w-8 animate-spin text-emerald-400"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-20"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="opacity-90"
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  processingLabel: string;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  title,
  message,
  confirmLabel,
  processingLabel,
  isProcessing,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isProcessing) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProcessing, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      role="presentation"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative my-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1115] p-6 shadow-2xl shadow-black/50"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-white"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-message"
          className="mt-2 text-sm leading-relaxed text-gray-400"
        >
          {message}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            autoFocus
            className="rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="rounded-lg border border-rose-400/30 bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? processingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

interface NoticeToastProps {
  notice: Notice;
  onDismiss: () => void;
}

const NoticeToast = ({ notice, onDismiss }: NoticeToastProps) => {
  const isError = notice.type === "error";

  return (
    <div className="fixed inset-x-4 top-4 z-[60] sm:left-auto sm:right-4 sm:w-96">
      <div
        role={isError ? "alert" : "status"}
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg shadow-black/40 backdrop-blur ${
          isError
            ? "border-rose-400/30 bg-[#1a1013]/95 text-rose-200"
            : "border-emerald-400/30 bg-[#0e1a14]/95 text-emerald-200"
        }`}
      >
        <p className="min-w-0 flex-1 break-words">{notice.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 transition-colors hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

const ExecutiveManagement = () => {
  const [entries, setEntries] = useState<ExecutiveWithTasks[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [notice, setNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [activeMutation, setActiveMutation] = useState<MutationKind | null>(
    null,
  );

  const isMountedRef = useRef<boolean>(true);
  const requestIdRef = useRef<number>(0);
  const mutationLockRef = useRef<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /* ------------------------------ Data loading ----------------------------- */

  const loadDashboard = useCallback(
    async (options?: { silent?: boolean }): Promise<void> => {
      const silent = options?.silent === true;
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
        setLoadError(null);
      }

      try {
        const nextEntries = await getExecutiveDashboard();

        if (!isMountedRef.current || requestId !== requestIdRef.current) {
          return;
        }
        setEntries(nextEntries);
      } catch (error) {
        if (!isMountedRef.current || requestId !== requestIdRef.current) {
          return;
        }

        const message = getErrorMessage(
          error,
          "Failed to load the executive dashboard.",
        );
        if (silent) {
          setNotice({
            type: "error",
            message: `Could not refresh the dashboard. ${message}`,
          });
        } else {
          setLoadError(message);
        }
      } finally {
        if (isMountedRef.current && requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  // Success notices clear themselves; errors stay until dismissed.
  useEffect(() => {
    if (!notice || notice.type !== "success") return undefined;

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  /* ----------------------------- Derived data ------------------------------ */

  const { executives, tasks, stats } = useMemo(
    () => buildViewModel(entries ?? []),
    [entries],
  );

  const executiveOptions = useMemo<ExecutiveOption[]>(
    () =>
      executives.map((executive) => ({
        id: executive.id,
        name: executive.name,
        email: executive.email,
      })),
    [executives],
  );

  /* ------------------------------ Mutations -------------------------------- */

  const beginMutation = (kind: MutationKind): boolean => {
    if (mutationLockRef.current) return false;

    mutationLockRef.current = true;
    setActiveMutation(kind);
    setNotice(null);
    return true;
  };

  const endMutation = (): void => {
    mutationLockRef.current = false;
    setActiveMutation(null);
  };

  const handleAssignTask = async (data: CreateTaskInput): Promise<void> => {
    if (!beginMutation("assign")) return;

    try {
      const payload: AssignTaskData = {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
      };
      await assignTask(payload);

      setIsModalOpen(false);
      setNotice({ type: "success", message: "Task assigned successfully." });
      await loadDashboard({ silent: true });
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to assign the task."),
      });
    } finally {
      endMutation();
    }
  };

  const demoteExecutive = async (userId: string): Promise<void> => {
    if (!beginMutation("demote")) return;

    try {
      const payload: UpdateUserRoleData = { role: "USER" };
      await updateUserRole(userId, payload);

      setConfirm(null);
      setNotice({ type: "success", message: "Executive demoted successfully." });
      await loadDashboard({ silent: true });
    } catch (error) {
      setConfirm(null);
      setNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to demote the executive."),
      });
    } finally {
      endMutation();
    }
  };

  const removeTask = async (taskId: string): Promise<void> => {
    if (!beginMutation("delete")) return;

    try {
      await deleteTask(taskId);

      setConfirm(null);
      setNotice({ type: "success", message: "Task deleted." });
      await loadDashboard({ silent: true });
    } catch (error) {
      setConfirm(null);
      setNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to delete the task."),
      });
    } finally {
      endMutation();
    }
  };

  const changeTaskStatus = async (
    taskId: string,
    status: TaskStatus,
  ): Promise<void> => {
    if (!beginMutation("status")) return;

    try {
      const payload: UpdateTaskStatusData = { status };
      await updateTaskStatus(taskId, payload);

      await loadDashboard({ silent: true });
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to update the task status."),
      });
    } finally {
      endMutation();
    }
  };

  /* ------------------------------- Handlers -------------------------------- */

  const handleOpenModal = (): void => {
    if (mutationLockRef.current) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    if (activeMutation === "assign") return;
    setIsModalOpen(false);
  };

  const handleDemoteRequest = (userId: string): void => {
    if (mutationLockRef.current) return;

    const executive = executives.find((item) => item.id === userId);
    const label = executive?.name?.trim() || executive?.email || "this executive";
    setConfirm({ kind: "demote", id: userId, label });
  };

  const handleDeleteRequest = (taskId: string): void => {
    if (mutationLockRef.current) return;

    const task = tasks.find((item) => item.id === taskId);
    setConfirm({ kind: "delete", id: taskId, label: task?.title ?? "this task" });
  };

  const handleStatusChange = (taskId: string, status: TaskStatus): void => {
    void changeTaskStatus(taskId, status);
  };

  const handleConfirm = (): void => {
    if (!confirm) return;

    if (confirm.kind === "demote") {
      void demoteExecutive(confirm.id);
    } else {
      void removeTask(confirm.id);
    }
  };

  const handleCancelConfirm = useCallback((): void => {
    setConfirm(null);
  }, []);

  /* -------------------------------- Render --------------------------------- */

  const hasData = entries !== null;
  const isConfirmProcessing =
    activeMutation === "demote" || activeMutation === "delete";
  const isTaskSectionBusy =
    activeMutation === "status" || activeMutation === "delete";

  const renderBody = () => {
    if (!hasData && isLoading) {
      return (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-24 text-center"
        >
          <Spinner />
          <p className="text-sm text-gray-400">
            Loading executive dashboard...
          </p>
        </div>
      );
    }

    if (!hasData) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/[0.05] px-6 py-16 text-center"
        >
          <div>
            <h2 className="text-lg font-semibold text-rose-100">
              Unable to load the dashboard
            </h2>
            <p className="mt-1 max-w-md break-words text-sm text-rose-200/80">
              {loadError ?? "Something went wrong while loading the data."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="rounded-lg border border-rose-400/30 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <>
        <ExecutiveStats {...stats} />

        <section aria-labelledby="executive-members-heading">
          <SectionHeading
            id="executive-members-heading"
            title="Executive Members"
            description="Members who currently hold the Executive role."
            count={executives.length}
          />
          <div
            className={busyClass(activeMutation === "demote")}
            aria-busy={activeMutation === "demote"}
          >
            <ExecutiveList
              executives={executives}
              onDemote={handleDemoteRequest}
            />
          </div>
        </section>

        <section aria-labelledby="executive-tasks-heading">
          <SectionHeading
            id="executive-tasks-heading"
            title="Tasks"
            description="Open tasks are listed first, ordered by due date."
            count={tasks.length}
          />
          <div
            className={busyClass(isTaskSectionBusy)}
            aria-busy={isTaskSectionBusy}
          >
            <TaskList
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteRequest}
            />
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] px-4 pb-12 pt-24 text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Executive Management
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Manage Executive members and the tasks assigned to them. Assign
              new tasks, track their progress, and remove or demote when
              needed.
            </p>
            {isRefreshing ? (
              <p
                role="status"
                aria-live="polite"
                className="mt-2 text-xs text-gray-500"
              >
                Refreshing...
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            disabled={!hasData || activeMutation !== null}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500 px-5 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Assign Task
          </button>
        </header>

        {renderBody()}
      </div>

      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        executives={executiveOptions}
        onSubmit={handleAssignTask}
        isSubmitting={activeMutation === "assign"}
      />

      {confirm ? (
        <ConfirmDialog
          title={confirm.kind === "demote" ? "Demote executive" : "Delete task"}
          message={
            confirm.kind === "demote"
              ? `${confirm.label} will no longer hold the Executive role. This changes their access immediately.`
              : `"${confirm.label}" will be deleted. This action cannot be undone.`
          }
          confirmLabel={confirm.kind === "demote" ? "Demote" : "Delete"}
          processingLabel={
            confirm.kind === "demote" ? "Demoting..." : "Deleting..."
          }
          isProcessing={isConfirmProcessing}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      ) : null}

      {notice ? (
        <NoticeToast notice={notice} onDismiss={() => setNotice(null)} />
      ) : null}
    </div>
  );
};

export default ExecutiveManagement;