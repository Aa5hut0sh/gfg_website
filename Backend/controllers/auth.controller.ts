import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import * as authService from "../services/auth.service.ts";
import User from "../models/User.model.ts";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

type userRole = "USER"|"ADMIN";

export const generateAccessToken = ({id , role}: { id: string; role: userRole }): string => {
  return jwt.sign({ userId:id , role:role }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
};

export const generateRefreshToken = ({id , role}: { id: string; role: userRole }): string => {
  return jwt.sign(
    { userId:id , role:role },
    process.env.JWT_REFRESH_SECRET || "refresh-secret",
    {
      expiresIn: "30d",
    }
  );
};



export const signupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authService.createUser(email, hashedPassword, name );

    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

    res.status(201).json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};



export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user || !user.hashedPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.hashedPassword
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


export const googleLoginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Google token" });
    }

    const user = await authService.findOrCreateOAuthUser(
      {
        id: payload.sub!,
        email: payload.email,
        name: payload.name,
      },
      "google"
    );

    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

    res.json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh-secret"
    ) as { userId: string };

    const user = await authService.findUserById(decoded.userId);
     if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    const accessToken = generateAccessToken(user);

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
};



export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;

    const user = await authService.findUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};



export const logout = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};






export const adminLoginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, adminSecret } = req.body;

    const expectedSecret = process.env.ADMIN_SIGNUP_SECRET || process.env.ADMIN_SIGNUP_SECRET;
    if (!expectedSecret || adminSecret !== expectedSecret) {
      return res.status(401).json({ success: false, message: "Invalid admin secret key" });
    }

    const user = await User.findOne({ email, role: "ADMIN" });
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword || "");
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

    res.json({
      success: true,
      message: "Admin login successful",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};




export const adminSignupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    const expectedSecret = process.env.ADMIN_SIGNUP_SECRET;
    if (!expectedSecret || adminSecret !== expectedSecret) {
      return res.status(401).json({ success: false, message: "Invalid admin secret key" });
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      hashedPassword,
      role: "ADMIN",
    });

    const accessToken = generateAccessToken({ id: admin._id.toString(), role: admin.role });
    const refreshToken = generateRefreshToken({ id: admin._id.toString(), role: admin.role });

    res.json({
      success: true,
      message: "Admin created successfully",
      user: admin ,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};