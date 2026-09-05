import type { Request, Response, NextFunction } from "express";

export const parseEventFields = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.fields && typeof req.body.fields === "string") {
    try {
      req.body.fields = JSON.parse(req.body.fields);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in fields",
      });
    }
  }
  next();
};