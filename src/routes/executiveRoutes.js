import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  getExecutiveDashboard,
  updateUserRole,
  assignTask,
  updateTaskStatus,
} from '../controllers/executiveController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// View dashboard: ADMIN and EXECUTIVE only (Req 2 & 3)
router.get('/dashboard', authorizeRoles('ADMIN', 'EXECUTIVE'), getExecutiveDashboard);

// Promote / Demote user role: ADMIN only (Req 2)
router.patch('/users/:userId/role', authorizeRoles('ADMIN'), updateUserRole);

// Assign new task: ADMIN only (Req 4)
router.post('/tasks', authorizeRoles('ADMIN'), assignTask);

// Update task completion status: ADMIN and EXECUTIVE (Req 4)
router.patch('/tasks/:taskId/status', authorizeRoles('ADMIN', 'EXECUTIVE'), updateTaskStatus);

export default router;