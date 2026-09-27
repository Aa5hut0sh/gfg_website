import type { Request, Response, NextFunction } from 'express';
import * as executiveService from '../services/executive.service';

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    const user = await executiveService.updateRole(userId, role);
    return res.status(200).json({
      success: true,
      message: `Role updated successfully to ${role}`,
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

    const task = await executiveService.createAssignment(req.body);
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
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId || typeof taskId !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid taskId is required' });
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