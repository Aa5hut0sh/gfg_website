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

router.get('/dashboard', getDashboard);
router.patch('/users/:userId/role', updateUserRole);
router.post('/tasks', assignTask);
router.patch('/tasks/:taskId/status', updateTaskStatus);

export default router;
