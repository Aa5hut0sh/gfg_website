import { Router } from "express";
import {
  applyApplicationHandler,
  getFilledApplication,
  getAllApplication,
  updateApplicationHandler,
  getStatus,
  withdrawApplicationHandler,
  exportApplicationsToExcel,
} from "../controllers/application.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  applicationSchema,
  updateApplicationSchema,
  validate,
} from "./../middlewares/validation.middleware.ts";
const router = Router();

router.post(
  "/apply",
  authenticate,
  validate(applicationSchema),
  applyApplicationHandler,
);
router.get("/filled", authenticate, getFilledApplication);
router.get("/all", authenticate, getAllApplication);
router.put(
  "/update",
  authenticate,
  validate(updateApplicationSchema),
  updateApplicationHandler,
);
router.get("/status", authenticate, getStatus);
router.delete("/withdraw", authenticate, withdrawApplicationHandler);
router.get("/export", authenticate, exportApplicationsToExcel);

export default router;
