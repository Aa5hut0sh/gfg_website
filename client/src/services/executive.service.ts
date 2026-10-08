import api from "../lib/api";
import type {
  AssignTaskData,
  ExecutiveDashboardResponse,
  ExecutiveUser,
  ExecutiveWithTasks,
  MyTasksResponse,
  Task,
  TaskResponse,
  TaskSummaryResponse,
  UpdateTaskStatusData,
  UpdateUserRoleData,
  UpdateUserRoleResponse,
} from "../types/executive.types";

const BASE_PATH = "/executives";

/**
 * Note: lib/api.ts does not unwrap responses, so `response.data` is the full
 * backend body. Each function below reads the property that endpoint uses.
 */

/**
 * GET /api/executives/dashboard
 * Body: { success, data: ExecutiveWithTasks[] }
 */
export const getExecutiveDashboard = async (): Promise<
  ExecutiveWithTasks[]
> => {
  const response = await api.get<ExecutiveDashboardResponse>(
    `${BASE_PATH}/dashboard`
  );
  return response.data.data;
};

/**
 * PATCH /api/executives/users/:userId/role
 * Body: { success, message, user }
 */
export const updateUserRole = async (
  userId: string,
  payload: UpdateUserRoleData
): Promise<ExecutiveUser> => {
  const response = await api.patch<UpdateUserRoleResponse>(
    `${BASE_PATH}/users/${userId}/role`,
    payload
  );
  return response.data.user;
};

/**
 * POST /api/executives/tasks
 * Body: { success, task }
 */
export const assignTask = async (payload: AssignTaskData): Promise<Task> => {
  const response = await api.post<TaskResponse>(`${BASE_PATH}/tasks`, payload);
  return response.data.task;
};

/**
 * DELETE /api/executives/tasks/:taskId
 * Body: { success, message } (not returned)
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`${BASE_PATH}/tasks/${taskId}`);
};

/**
 * GET /api/executives/tasks/my
 * Body: { success, count, tasks }
 */
export const getMyTasks = async (): Promise<Task[]> => {
  const response = await api.get<MyTasksResponse>(`${BASE_PATH}/tasks/my`);
  return response.data.tasks;
};

/**
 * GET /api/executives/tasks/:taskId
 * Body: { success, task }
 */
export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await api.get<TaskResponse>(`${BASE_PATH}/tasks/${taskId}`);
  return response.data.task;
};

/**
 * PATCH /api/executives/tasks/:taskId/status
 * Status: PENDING | IN_PROGRESS | COMPLETED
 * Body: { success, task }
 */
export const updateTaskStatus = async (
  taskId: string,
  payload: UpdateTaskStatusData
): Promise<Task> => {
  const response = await api.patch<TaskResponse>(
    `${BASE_PATH}/tasks/${taskId}/status`,
    payload
  );
  return response.data.task;
};

/**
 * GET /api/executives/tasks/summary
 * Body: { success, summary, recentlyCompleted }
 * Returns the complete body; there is no `data` wrapper on this endpoint.
 */
export const getTaskSummary = async (): Promise<TaskSummaryResponse> => {
  const response = await api.get<TaskSummaryResponse>(
    `${BASE_PATH}/tasks/summary`
  );
  return response.data;
};

/**
 * GET /api/executives/tasks/overdue
 * Body: { success, count, tasks }
 */
export const getOverdueTasks = async (): Promise<Task[]> => {
  const response = await api.get<MyTasksResponse>(`${BASE_PATH}/tasks/overdue`);
  return response.data.tasks;
};