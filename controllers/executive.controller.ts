import { Request, Response } from 'express';
import * as executiveService from '../services/executive.service';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const data = await executiveService.getExecutivesWithTasks();
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await executiveService.updateRole(userId, role);
    return res.status(200).json({ success: true, message: `Role updated to ${role}`, user });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const assignTask = async (req: Request, res: Response) => {
  try {
    const task = await executiveService.createAssignment(req.body);
    return res.status(201).json({ success: true, task });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req: any, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await executiveService.modifyTaskStatus(
      taskId,
      status,
      req.user?._id || req.user?.id,
      req.user?.role
    );
    return res.status(200).json({ success: true, task });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
