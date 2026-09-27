
import dotenv from "dotenv";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";

dotenv.config();

import connectDB from "./config/db";
import AuthRouter from "./routes/auth.route";
import ApplicationRouter from "./routes/application.route";
import EventRouter from "./routes/event.route";
import userRouter from "./routes/user.route";
import TeamMemberRouter from "./routes/teamMember.routes";
import executiveRoute from "./routes/executive.route";
import { startCronJobs } from "./syncAllProfile";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
startCronJobs();

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", AuthRouter);
app.use("/api/application", ApplicationRouter);
app.use("/api/event", EventRouter);
app.use("/api/user", userRouter);
app.use("/api/team", TeamMemberRouter);
app.use("/api/executives", executiveRoute);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`App is listening universally on PORT = ${PORT}`);
});