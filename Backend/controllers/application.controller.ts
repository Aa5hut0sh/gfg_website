import type { Request, Response, NextFunction } from "express";
import ExcelJS from "exceljs";
import {
  allApplication,
  createApplication,
  deleteForm,
  getexistingApplication,
} from "../services/Application.service";

export const applyApplicationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const userId = req.userId;
    const role = req.role;

    if (role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admins can't fill the form",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const existingApplication = await getexistingApplication(userId);

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted an application",
      });
    }

    const form = await createApplication(userId, body);

    res.status(201).json({
      sucess: true,
      form,
    });
  } catch (err) {
    next(err);
  }
};
export const getFilledApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const role = req.role;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admins can't fill the form",
      });
    }

    const application = await getexistingApplication(userId);

    if (!application) {
      return res.status(404).json({
        success: false,
        messgae: "No Application found",
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    next(err);
  }
};
export const getAllApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const role = req.role;

    if (role == "USER") {
      return res.status(400).json({
        success: false,
        message: "Only admins can access all the forms",
      });
    }

    const forms = await allApplication();

    res.status(200).json({
      success: true,
      forms,
    });
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const form = await getexistingApplication(userId);

    if (!form) {
      return res.status(404).json({
        success: false,
        messgae: "No Application found",
      });
    }

    res.status(200).json({
      success: true,
      status: form.status,
    });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.role;
    const { newStatus, userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (role === "USER") {
      return res.status(400).json({
        success: false,
        message: "Only admins can update the status",
      });
    }

    const form = await getexistingApplication(userId);

    if (!form) {
      return res.status(404).json({
        success: false,
        messgae: "No Application found",
      });
    }

    form.status = newStatus;
    form.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      form,
    });
  } catch (err) {
    next(err);
  }
};
export const withdrawApplicationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const role = req.role;

    if (role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admins can't delete the form",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    await deleteForm(userId);

    res.status(201).json({
      sucess: true,
      message: "You application has been deleted",
    });
  } catch (err) {
    next(err);
  }
};


export const exportApplicationsToExcel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.role;

    if (role === "USER") {
      return res.status(403).json({
        success: false,
        message: "Only admins can export applications",
      });
    }

    const applications = await allApplication();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Roll No", key: "rollNo", width: 15 },
      { header: "Mobile No", key: "mobileNo", width: 15 },
      { header: "Preference 1", key: "preference1", width: 20 },
      { header: "Preference 2", key: "preference2", width: 20 },
      { header: "Preference 3", key: "preference3", width: 20 },
      { header: "Skills", key: "skills", width: 30 },
      { header: "Reason", key: "reason", width: 40 },
      { header: "Other Clubs", key: "otherClubs", width: 25 },
      { header: "Status", key: "status", width: 12 },
      { header: "Applied At", key: "createdAt", width: 22 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2F8D46" },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

    for (const app of applications) {
      const user = app.user as any;
      worksheet.addRow({
        name: user?.name || "N/A",
        email: user?.email || "N/A",
        rollNo: app.rollNo,
        mobileNo: app.MobileNo,
        preference1: app.preference1,
        preference2: app.preference2 || "N/A",
        preference3: app.preference3 || "N/A",
        skills: app.skills?.join(", ") || "N/A",
        reason: app.reason,
        otherClubs: app.OtherClubs?.join(", ") || "N/A",
        status: app.status,
        createdAt: app.createdAt
          ? new Date(app.createdAt).toLocaleString()
          : "N/A",
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};
