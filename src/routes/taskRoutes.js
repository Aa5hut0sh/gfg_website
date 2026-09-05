import express from "express";
import { createTask, updateTaskStatus } from "../controllers/taskController.js";
import { authenticateUser, requireRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

// Task assignment (Requirement 4: Admin only)
router.post("/", requireRoles("ADMIN"), createTask);

// Task status tracking (Requirement 4: Admin & Assigned Executive)
router.patch("/:taskId/status", requireRoles("ADMIN", "EXECUTIVE"), updateTaskStatus);

export default router;