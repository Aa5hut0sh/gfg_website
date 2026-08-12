import type { Request, Response, NextFunction } from "express";
import EventModel from "../models/Event.model";
import EventRegistrationModel from "../models/EventRegistration.model";
import cloudinary from "../config/cloudinary.js";
import { success } from "zod";

export const createEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "events" },
    );

    let fields = req.body.fields;

    if (typeof fields === "string") {
      fields = JSON.parse(fields);
    }

    const event = await EventModel.create({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline ? new Date(req.body.deadline) : null,
      isActive: req.body.isActive === "true" || req.body.isActive === true,
      image: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      fields: fields,
      createdBy: req.userId,
    });

    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

export const registerEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const eventId = id;
    let { responses } = req.body;

    if (req.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (typeof responses === "string") {
      try {
        responses = JSON.parse(responses);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid responses JSON",
        });
      }
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isActive) {
      return res.status(400).json({
        success: false,
        message: "Event is not active",
      });
    }

    if (event.deadline && event.deadline < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Event registration deadline has passed",
      });
    }

    for (const field of event.fields) {
      const value = responses?.[field.name];

      if (field.required && (value === undefined || value === "")) {
        return res.status(400).json({
          success: false,
          message: `${field.label} is required`,
        });
      }

      if (
        (field.type === "select" || field.type === "checkbox") &&
        Array.isArray(field.options) &&
        field.options.length > 0 &&
        value !== undefined &&
        !field.options.includes(value)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid value for ${field.label}`,
        });
      }
    }

    const alreadyRegistered = await EventRegistrationModel.findOne({
      event: eventId,
      user: userId,
    });

    if (alreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event",
      });
    }

    const registration = await EventRegistrationModel.create({
      event: eventId,
      user: userId,
      responses,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered for event",
      registration,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const events = await EventModel.find();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    next(err);
  }
};
export const getAllActiveEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const events = await EventModel.find({ isActive: true });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    next(err);
  }
};
export const DeleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;
    await EventModel.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Event has been removed",
    });
  } catch (err) {
    next(err);
  }
};
export const UpdateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { eventId } = req.params;

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let fields = req.body.fields;
    if (fields) {
      if (typeof fields === "string") {
        try {
          fields = JSON.parse(fields);
        } catch {
          return res.status(400).json({
            success: false,
            message: "Invalid fields JSON",
          });
        }
      }
      event.fields = fields;
    }

    if (req.body.title) event.title = req.body.title;
    if (req.body.description) event.description = req.body.description;

    if (req.body.isActive !== undefined) {
      event.isActive =
        req.body.isActive === "true" || req.body.isActive === true;
    }

    if (req.body.deadline) {
      const deadline = new Date(req.body.deadline);
      if (isNaN(deadline.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid deadline format",
        });
      }
      event.deadline = deadline;
    }

    if (req.file) {
      if (event.image?.publicId) {
        await cloudinary.uploader.destroy(event.image.publicId);
      }

      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "events" },
      );

      event.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllResponse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;
    const responses = await EventRegistrationModel.find({ event: id });

    res.status(200).json({
      success: true,
      responses,
    });
  } catch (err) {
    next(err);
  }
};
export const getEventbyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id); 

    if(!event){
        return res.status(404).json({
            success: false,
            message: "Event does not exist"
        });
    }
    res.status(200).json({
      success: true,
      event,
    });
  } catch (err) {
    next(err);
  }
};


export const getMyRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { id } = req.params; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const registration = await EventRegistrationModel.findOne({
      event: id,
      user: userId,
    }).lean(); 

    res.status(200).json({
      success: true,
      registration: registration || null,
    });
  } catch (err) {
    next(err);
  }
};
