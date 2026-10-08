import TaskCard from "./TaskCard";
import type { TaskCardStatus, TaskCardTask } from "./TaskCard";

export interface TaskListProps {
  tasks: TaskCardTask[];
  onStatusChange?: (taskId: string, status: TaskCardStatus) => void;
  onDelete?: (taskId: string) => void;
}

const TaskList = ({ tasks, onStatusChange, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <section
        aria-label="Task list"
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
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M9 12h6" />
            <path d="M9 16h4" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-200">
          No tasks found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          There are no tasks to display right now.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Task list">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {tasks.map((task) => (
          <li key={task.id} className="min-w-0">
            <TaskCard
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TaskList;