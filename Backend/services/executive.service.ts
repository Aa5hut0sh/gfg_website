import User from '../models/User.model';
import Task from '../models/Task.model';

export const getExecutivesWithTasks = async () => {
  const executives = await User.find({ role: 'EXECUTIVE' }).select('-hashedPassword');

  return Promise.all(
    executives.map(async (exec) => {
      const tasks = await Task.find({ assignedTo: exec._id }).sort({ createdAt: -1 });
      return {
        executive: exec,
        taskCount: tasks.length,
        tasks,
      };
    })
  );
};

export const updateRole = async (userId: string, role: string) => {
  if (!['USER', 'EXECUTIVE', 'ADMIN'].includes(role)) {
    throw new Error('Invalid role specified');
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-hashedPassword');

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

export const createAssignment = async (data: {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate?: Date;
}) => {
  const targetUser = await User.findById(data.assignedTo);
  if (!targetUser) {
    throw new Error('Assignee user not found');
  }

  if ((targetUser.role as string) !== 'EXECUTIVE') {
    throw new Error('Tasks can only be assigned to users with the EXECUTIVE role');
  }

  return Task.create(data);
};

export const modifyTaskStatus = async (
  taskId: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
  userId: string,
  userRole?: string
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  if (userRole !== 'ADMIN' && task.assignedTo.toString() !== userId) {
    throw new Error('Unauthorized to update this task status');
  }

  task.status = status;
  return task.save();
};