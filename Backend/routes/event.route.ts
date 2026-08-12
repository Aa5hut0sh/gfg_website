import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createEventHandler,
  DeleteEvent,
  getAllActiveEvent,
  getAllEvent,
  getAllResponse,
  registerEventHandler,
  UpdateEvent,
  getEventbyId,
  getMyRegistration 
} from "../controllers/event.controller";
import {parseEventFields} from "../middlewares/parsedFiels.middleware"
import { validate , createEventSchema , registerEventSchema , updateEventSchema } from "../middlewares/validation.middleware";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post(
  "/create",
  authenticate,
  upload.single("image"),
  parseEventFields,
  validate(createEventSchema),
  createEventHandler,
);
router.get("/all", getAllEvent);
router.put("/update/:eventId", authenticate, upload.single("image"),parseEventFields , validate(updateEventSchema), UpdateEvent);
router.delete("/delete/:id", authenticate, DeleteEvent);
router.get("/responses/:id", authenticate, getAllResponse);

router.get("/active", authenticate, getAllActiveEvent);
router.post("/register/:id", authenticate , validate(registerEventSchema), registerEventHandler);
router.get("/my-registration/:id", authenticate, getMyRegistration);
router.get("/:id",getEventbyId);

export default router;
