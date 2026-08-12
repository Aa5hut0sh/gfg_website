import { Router } from "express";
import * as authController from "../controllers/auth.controller.ts";
import { authenticate } from "./../middlewares/auth.middleware.ts";
import {
  validate,
  signupSchema,
  loginSchema,
  googleLoginSchema,
  refreshTokenSchema,
  adminSignupSchema,
  adminLoginSchema,
} from "./../middlewares/validation.middleware.ts";

const router = Router();

router.post("/signup", validate(signupSchema), authController.signupHandler);
router.post("/login", validate(loginSchema), authController.loginHandler);
router.post(
  "/google",
  validate(googleLoginSchema),
  authController.googleLoginHandler,
);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshTokenHandler,
);
router.post("/logout", authController.logout);

router.post(
  "/admin/login",
  validate(adminLoginSchema),
  authController.adminLoginHandler,
);

router.post(
  "/admin/signup",
  validate(adminSignupSchema),
  authController.adminSignupHandler,
);

router.get("/me", authenticate, authController.getCurrentUser);

export default router;