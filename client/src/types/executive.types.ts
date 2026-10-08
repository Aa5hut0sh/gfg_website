/**
 * Executive Management System types
 * Mirrors the backend router mounted at /api/executives
 *
 * Every endpoint responds with a JSON body that is NOT unwrapped by
 * lib/api.ts, so `response.data` in the service is the full body described
 * by the "Response envelopes" section below.
 */

/* -------------------------------------------------------------------------- */
/*                                   Enums                                    */
/* -------------------------------------------------------------------------- */

export type UserRole = "ADMIN" | "USER" | "EXECUTIVE";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

/* -------------------------------------------------------------------------- */
/*                                   Users                                    */
/* -------------------------------------------------------------------------- */

/**
 * A user as returned by the executive endpoints.
 * Only `_id` and `role` are guaranteed by the backend contract; other
 * profile fields are optional because they depend on what the API selects.
 */
export interface ExecutiveUser {
  _id: string;
  role: UserRole;
  name?: string;
  email?: string;
}

/**
 * MongoDB reference that may be either a raw ObjectId string
 * or a populated user document.
 */
export type PopulatedUser = ExecutiveUser;
export type UserRef = string | PopulatedUser;

/* -------------------------------------------------------------------------- */
/*                                   Tasks                                    */
/* -------------------------------------------------------------------------- */

/**
 * Task document. Dates are serialized as ISO strings over JSON.
 *
 * `assignedTo` / `assignedBy` are raw ID strings unless the backend
 * populated them. The dashboard returns raw IDs; the single-task, "my tasks",
 * overdue and summary endpoints populate one or both.
 *
 * `description` and `dueDate` are optional in the backend model, and
 * `completedAt` is null by default and omitted once a task is reopened.
 */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: UserRef;
  assignedBy: UserRef;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Per-executive summary, as nested in each dashboard entry.
 */
export interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
}

/**
 * Organisation-wide summary returned by GET /tasks/summary.
 * Note the status counts are keyed by the status values themselves,
 * unlike the camelCase per-executive `TaskSummary`.
 */
export interface OverallTaskSummary extends Record<TaskStatus, number> {
  total: number;
  overdue: number;
}

/* -------------------------------------------------------------------------- */
/*                               Dashboard shapes                             */
/* -------------------------------------------------------------------------- */

export interface ExecutiveWithTasks {
  executive: ExecutiveUser;
  summary: TaskSummary;
  tasks: Task[];
}

/* -------------------------------------------------------------------------- */
/*                              Response envelopes                            */
/* -------------------------------------------------------------------------- */

/** GET /api/executives/dashboard */
export interface ExecutiveDashboardResponse {
  success?: boolean;
  message?: string;
  data: ExecutiveWithTasks[];
}

/** GET /api/executives/tasks/my  and  GET /api/executives/tasks/overdue */
export interface MyTasksResponse {
  success?: boolean;
  count: number;
  tasks: Task[];
}

/** GET /api/executives/tasks/:taskId, POST /tasks, PATCH /tasks/:taskId/status */
export interface TaskResponse {
  success?: boolean;
  task: Task;
}

/** GET /api/executives/tasks/summary */
export interface TaskSummaryResponse {
  success?: boolean;
  summary: OverallTaskSummary;
  recentlyCompleted: Task[];
}

/** PATCH /api/executives/users/:userId/role */
export interface UpdateUserRoleResponse {
  success?: boolean;
  message?: string;
  user: ExecutiveUser;
}

/* -------------------------------------------------------------------------- */
/*                               Request payloads                             */
/* -------------------------------------------------------------------------- */

/**
 * POST /api/executives/tasks
 * The backend requires `title` and `assignedTo`; `description` and `dueDate`
 * are optional, and a provided `dueDate` must not be in the past.
 */
export interface AssignTaskData {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate?: string;
}

/** PATCH /api/executives/tasks/:taskId/status */
export interface UpdateTaskStatusData {
  status: TaskStatus;
}

/** PATCH /api/executives/users/:userId/role */
export interface UpdateUserRoleData {
  role: UserRole;
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/** Type guard: true when a reference has been populated into a user object. */
export const isPopulatedUser = (ref: UserRef): ref is PopulatedUser =>
  typeof ref === "object" && ref !== null && "_id" in ref;

/** Extracts the ID from either a raw ID string or a populated user. */
export const getUserRefId = (ref: UserRef): string =>
  isPopulatedUser(ref) ? ref._id : ref;