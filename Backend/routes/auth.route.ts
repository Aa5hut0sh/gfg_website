import { Router } from "express";
import rateLimit from "express-rate-limit";
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

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many OTP requests from this IP, please try again after a minute."
  }
});

router.post("/send-otp", otpLimiter, authController.sendOtp);
router.post("/forgot-password-otp", otpLimiter, authController.forgotPasswordOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-otp", authController.verifyOtp);
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