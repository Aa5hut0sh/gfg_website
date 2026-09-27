import User from '../models/User.model';
import Task from '../models/Task.model';
import mongoose from 'mongoose';


export const getExecutivesWithTasks = async () => {
  const executives = await User.find({ role: 'EXECUTIVE' }).select('-hashedPassword');

  return Promise.all(
    executives.map(async (exec) => {
      const tasks = await Task.find({ assignedTo: exec._id }).sort({ createdAt: -1 });

      const now = new Date();
      const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
      const pending = tasks.filter((t) => t.status === 'PENDING').length;
      const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const overdue = tasks.filter(
        (t) => t.dueDate && t.dueDate < now && t.status !== 'COMPLETED'
      ).length;

      return {
        executive: exec,
        summary: {
          total: tasks.length,
          completed,
          pending,
          inProgress,
          overdue,
        },
        tasks,
      };
    })
  );
};


export const updateRole = async (userId: string, role: string) => {
  const normalizedRole = role.trim().toUpperCase();

  if (!['USER', 'EXECUTIVE', 'ADMIN'].includes(normalizedRole)) {
    throw new Error('Invalid role specified. Allowed values: USER, EXECUTIVE, ADMIN');
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: normalizedRole },
    { new: true, runValidators: true }
  ).select('-hashedPassword');

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};


export const createAssignment = async (
  data: {
    title: string;
    description?: string;
    assignedTo: string;
    dueDate?: string | Date;
  },
  assignedBy: string
) => {
  if (!data.title || !data.title.trim()) {
    throw new Error('Task title is required');
  }

  if (!data.assignedTo) {
    throw new Error('Assignee (assignedTo) is required');
  }

  const targetUser = await User.findById(data.assignedTo);
  if (!targetUser) {
    throw new Error('Assignee user not found');
  }

  if ((targetUser.role as string) !== 'EXECUTIVE') {
    throw new Error('Tasks can only be assigned to users with the EXECUTIVE role');
  }

  // Validate dueDate if provided
  let dueDate: Date | undefined;
  if (data.dueDate) {
    dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      throw new Error('Invalid due date format');
    }
    if (dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }
  }

  return Task.create({
    title: data.title.trim(),
    description: data.description?.trim(),
    assignedTo: data.assignedTo,
    assignedBy,
    dueDate,
  });
};


export const modifyTaskStatus = async (
  taskId: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
  userId: string,
  userRole?: string
) => {
  if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    throw new Error('Invalid status. Allowed values: PENDING, IN_PROGRESS, COMPLETED');
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  // Executives can only update their own tasks
  if (userRole !== 'ADMIN' && task.assignedTo.toString() !== userId) {
    throw new Error('Unauthorized: you can only update your own tasks');
  }

  task.status = status;

  if (status === 'COMPLETED') {
    task.completedAt = new Date();
  } else {
    task.completedAt = undefined;
  }

  return task.save();
};


export const getTasksForUser = async (userId: string, filters?: { status?: string }) => {
  const query: any = { assignedTo: userId };

  if (filters?.status && ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(filters.status)) {
    query.status = filters.status;
  }

  return Task.find(query)
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 });
};


export const getOverdueTasks = async () => {
  const now = new Date();

  return Task.find({
    dueDate: { $lt: now },
    status: { $ne: 'COMPLETED' },
  })
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email')
    .sort({ dueDate: 1 });
};


export const getTaskSummary = async () => {
  const now = new Date();

  const [statusCounts, overdueTasks, recentlyCompleted] = await Promise.all([
    Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.countDocuments({
      dueDate: { $lt: now },
      status: { $ne: 'COMPLETED' },
    }),
    Task.find({ status: 'COMPLETED' })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email'),
  ]);

  const summary: Record<string, number> = {
    total: 0,
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    overdue: overdueTasks,
  };

  for (const item of statusCounts) {
    summary[item._id] = item.count;
    summary.total += item.count;
  }

  return { summary, recentlyCompleted };
};


export const deleteTask = async (taskId: string) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};


export const getTaskById = async (taskId: string) => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email role')
    .populate('assignedBy', 'name email role');

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};