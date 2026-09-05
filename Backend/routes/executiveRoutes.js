import { authenticateUser, requireRoles } from "../middlewares/auth.js";
import { getExecutives, updateRole, getExecutiveTasks } from "../controllers/executiveController.js";
import express from "express";
import {
  getExecutives,
  updateRole,
  getExecutiveTasks,
} from "../controllers/executiveController.js";
import { authenticateUser, requireRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateUser);

// Admin & Executive screens (Requirement 3: non-public)
router.get("/", requireRoles("ADMIN", "EXECUTIVE"), getExecutives);
router.get("/:userId/tasks", requireRoles("ADMIN", "EXECUTIVE"), getExecutiveTasks);

// Promote / Demote user role (Requirement 2: Admin only)
router.patch("/:userId/role", requireRoles("ADMIN"), updateRole);

export default router;