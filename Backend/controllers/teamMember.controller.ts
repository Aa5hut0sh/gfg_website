import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import TeamMember from "../models/TeamMember.model";
import cloudinary from "../config/cloudinary";

const MIN_YEAR = 2023;
const MAX_YEAR = 2035;

const isValidBatchYear = (year: number) => {
  return (
    Number.isInteger(year) &&
    year >= MIN_YEAR &&
    year <= MAX_YEAR
  );
};

export const createTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let uploadedPublicId: string | null = null;

  try {

    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Team member photo is required",
      });
    }

    const {
      name,
      role,
      batchYear,
      linkedin,
      github,
      order,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!role?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const year = Number(batchYear);

    if (!isValidBatchYear(year)) {
      return res.status(400).json({
        success: false,
        message: `Batch year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
      });
    }

 

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "gfg-team",
      },
    );

    uploadedPublicId = uploadResult.public_id;


    const transparentUrl = cloudinary.url(
      uploadResult.public_id,
      {
        secure: true,
        format: "png",
        transformation: [
          {
            effect: "background_removal",
          },
        ],
      },
    );

  

    const member = await TeamMember.create({
      name: name.trim(),
      role: role.trim(),
      batchYear: year,

      linkedin: linkedin?.trim() || "",
      github: github?.trim() || "",

      order: Number(order) || 0,

      photo: {
        url: transparentUrl,
        publicId: uploadResult.public_id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Team member created successfully",
      member,
    });
  } catch (error) {
    /* Cleanup Cloudinary upload if MongoDB fails */
    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(
          uploadedPublicId,
        );
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup failed:",
          cleanupError,
        );
      }
    }

    next(error);
  }
};



export const getTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { batchYear } = req.query;

    const filter: Record<string, any> = {};

    if (batchYear !== undefined) {
      const year = Number(batchYear);

      if (!isValidBatchYear(year)) {
        return res.status(400).json({
          success: false,
          message: `Batch year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
        });
      }

      filter.batchYear = year;
    }

    const members = await TeamMember.find(filter)
      .sort({
        batchYear: -1,
        order: 1,
        createdAt: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    next(error);
  }
};


export const getTeamMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID",
      });
    }

    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    next(error);
  }
};



export const updateTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let newUploadedPublicId: string | null = null;

  try {
    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID",
      });
    }

    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    const {
      name,
      role,
      batchYear,
      linkedin,
      github,
      order,
    } = req.body;

    if (name !== undefined) {
      member.name = name.trim();
    }

    if (role !== undefined) {
      member.role = role.trim();
    }

    if (batchYear !== undefined) {
      const year = Number(batchYear);

      if (!isValidBatchYear(year)) {
        return res.status(400).json({
          success: false,
          message: `Batch year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
        });
      }

      member.batchYear = year;
    }

    if (linkedin !== undefined) {
      member.linkedin = linkedin.trim();
    }

    if (github !== undefined) {
      member.github = github.trim();
    }

    if (order !== undefined) {
      member.order = Number(order) || 0;
    }



    if (req.file) {
      const oldPublicId =
        member.photo?.publicId;

      /* Upload new original */
      const uploadResult =
        await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
          {
            folder: "gfg-team",
          },
        );

      newUploadedPublicId =
        uploadResult.public_id;

      /* Generate transparent URL */
      const transparentUrl =
        cloudinary.url(
          uploadResult.public_id,
          {
            secure: true,
            format: "png",
            transformation: [
              {
                effect: "background_removal",
              },
            ],
          },
        );

      member.photo = {
        url: transparentUrl,
        publicId: uploadResult.public_id,
      };

      /* Delete old image */
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(
            oldPublicId,
          );
        } catch (error) {
          console.error(
            "Old Cloudinary image deletion failed:",
            error,
          );
        }
      }

      newUploadedPublicId = null;
    }

    await member.save();

    return res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      member,
    });
  } catch (error) {
    /* Cleanup new upload if update fails */
    if (newUploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(
          newUploadedPublicId,
        );
      } catch (cleanupError) {
        console.error(
          "New Cloudinary image cleanup failed:",
          cleanupError,
        );
      }
    }

    next(error);
  }
};


export const deleteTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team member ID",
      });
    }

    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    if (member.photo?.publicId) {
      try {
        await cloudinary.uploader.destroy(
          member.photo.publicId,
        );
      } catch (error) {
        console.error(
          "Cloudinary image deletion failed:",
          error,
        );
      }
    }

    await TeamMember.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};