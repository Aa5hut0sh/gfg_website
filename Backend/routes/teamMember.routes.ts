import { Router } from "express";
import multer from "multer";

import { authenticate } from "../middlewares/auth.middleware";

import {
  createTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamMember.controller";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post(
  "/create",
  authenticate,
  upload.single("photo"),
  createTeamMember,
);

router.get(
  "/",
  getTeamMembers,
);

router.put(
  "/update/:id",
  authenticate,
  upload.single("photo"),
  updateTeamMember,
);

router.delete(
  "/delete/:id",
  authenticate,
  deleteTeamMember,
);

router.get(
  "/:id",
  getTeamMemberById,
);

export default router;