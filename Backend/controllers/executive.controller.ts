import type { Request, Response, NextFunction } from 'express';
import * as executiveService from '../services/executive.service';


export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required to view the executive dashboard',
      });
    }

    const data = await executiveService.getExecutivesWithTasks();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required to change user roles',
      });
    }

    const { userId } = req.params;
    const { role } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid userId is required' });
    }

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required in request body' });
    }

    const user = await executiveService.updateRole(userId, role);
    return res.status(200).json({
      success: true,
      message: `Role updated successfully to ${user.role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};


export const assignTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required to assign tasks',
      });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const task = await executiveService.createAssignment(req.body, req.userId);
    return res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};


export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN' && req.role !== 'EXECUTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Only executives and admins can update task status',
      });
    }

    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId || typeof taskId !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid taskId is required' });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required in request body' });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const task = await executiveService.modifyTaskStatus(
      taskId,
      status,
      req.userId,
      req.role
    );

    return res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'EXECUTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Only executives can access their own task list',
      });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const status = req.query.status as string | undefined;
    const tasks = await executiveService.getTasksForUser(req.userId, { status });

    return res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};


export const getOverdueTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required to view overdue tasks',
      });
    }

    const tasks = await executiveService.getOverdueTasks();
    return res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};


export const getTaskSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required to view task summary',
      });
    }

    const data = await executiveService.getTaskSummary();
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};


export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN' && req.role !== 'EXECUTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const taskId = req.params.taskId as string;

    const task = await executiveService.getTaskById(taskId);

    // Executives can only view their own tasks
    if (req.role === 'EXECUTIVE' && task.assignedTo.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own tasks',
      });
    }

    return res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};


export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required to delete tasks',
      });
    }

    const taskId = req.params.taskId as string;
    await executiveService.deleteTask(taskId);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};