import { Router } from 'express';
import {
  getDashboard,
  updateUserRole,
  assignTask,
  updateTaskStatus,
  getMyTasks,
  getOverdueTasks,
  getTaskSummary,
  getTaskById,
  deleteTask,
} from '../controllers/executive.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();


router.use(authenticate);


router.get('/dashboard', getDashboard);
router.get('/tasks/summary', getTaskSummary);
router.get('/tasks/overdue', getOverdueTasks);


router.patch('/users/:userId/role', updateUserRole);


router.post('/tasks', assignTask);
router.delete('/tasks/:taskId', deleteTask);


router.get('/tasks/my', getMyTasks);


router.get('/tasks/:taskId', getTaskById);
router.patch('/tasks/:taskId/status', updateTaskStatus);

export default router;