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

//admin - management routes

router.get('/dashboard', getDashboard);
router.get('/tasks/summary', getTaskSummary);
router.get('/tasks/overdue', getOverdueTasks);

//admin - user executive allow routes

router.patch('/users/:userId/role', updateUserRole);

//admin - task management routes

router.post('/tasks', assignTask);
router.delete('/tasks/:taskId', deleteTask);

// executive - task management routes
router.get('/tasks/my', getMyTasks);


router.get('/tasks/:taskId', getTaskById);
router.patch('/tasks/:taskId/status', updateTaskStatus);

// get all users from /users/profiles/all route

export default router;