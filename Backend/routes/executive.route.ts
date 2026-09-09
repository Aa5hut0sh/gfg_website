import { Router } from 'express';
import {
  getDashboard,
  updateUserRole,
  assignTask,
  updateTaskStatus,
} from '../controllers/executive.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Executive list & dashboard overview
router.get('/dashboard', getDashboard);

// Admin-only role elevation
router.patch('/users/:userId/role', updateUserRole);

// Task assignment
router.post('/tasks', assignTask);

// Task status modification
router.patch('/tasks/:taskId/status', updateTaskStatus);

export default router;