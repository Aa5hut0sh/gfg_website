import { User } from '../models/User.js';
import { Task } from '../models/Task.js';

// 1. Requirement 2: List all EXECUTIVE users along with their assigned tasks
export const getExecutiveDashboard = async (req, res) => {
  try {
    const executives = await User.find({ role: 'EXECUTIVE' }).select('-password');

    const dashboardData = await Promise.all(
      executives.map(async (exec) => {
        const tasks = await Task.find({ assignedTo: exec._id });
        return {
          executive: exec,
          taskCount: tasks.length,
          tasks,
        };
      })
    );

    res.status(200).json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Requirement 2: Promote or demote a USER to/from EXECUTIVE (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['USER', 'EXECUTIVE'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role update. You can only set role to USER or EXECUTIVE.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Requirement 4: Assign task to an executive (Admin only)
export const assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({ success: false, message: 'Assignee not found' });
    }

    if (assignee.role !== 'EXECUTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Tasks can only be assigned to users with the EXECUTIVE role.',
      });
    }

    const newTask = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
    });

    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Requirement 4: Update task status (Executive can update own tasks, Admin can update any)
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Choose from: PENDING, IN_PROGRESS, COMPLETED',
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Restrict: Executives can only change their own assigned tasks
    if (req.user.role === 'EXECUTIVE' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot update tasks assigned to other executives',
      });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ success: true, message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};