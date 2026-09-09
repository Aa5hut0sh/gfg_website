import { User } from '../models/User.model';
import { Task } from '../models/Task.model';

export const getExecutivesWithTasks = async () => {
  const executives = await User.find({ role: 'EXECUTIVE' }).select('-password');
  
  return Promise.all(
    executives.map(async (exec) => {
      const tasks = await Task.find({ assignedTo: exec._id });
      return {
        executive: exec,
        taskCount: tasks.length,
        tasks,
      };
    })
  );
};

export const updateRole = async (userId: string, role: 'USER' | 'EXECUTIVE') => {
  if (!['USER', 'EXECUTIVE'].includes(role)) {
    throw new Error('Role must be either USER or EXECUTIVE');
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

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
    throw new Error('User not found');
  }

  if (targetUser.role !== 'EXECUTIVE') {
    throw new Error('Task can only be assigned to a user with the EXECUTIVE role');
  }

  return Task.create(data);
};

export const modifyTaskStatus = async (
  taskId: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
  userId: string,
  userRole: string
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  if (userRole === 'EXECUTIVE' && task.assignedTo.toString() !== userId.toString()) {
    throw new Error('Executives can only update tasks assigned to them');
  }

  task.status = status;
  return task.save();
};
