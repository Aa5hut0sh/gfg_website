import User from "../models/User.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create and assign task to an Executive (Admin only)

export const createTask = async (req, res) => {
  const { title, description, assignedToId, dueDate } = req.body;

  if (!title || !assignedToId) {
    return res.status(400).json({ error: "Title and assignedToId are required." });
  }

  try {
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!assignee) {
      return res.status(404).json({ error: "Assignee user not found." });
    }

    if (assignee.role !== "EXECUTIVE") {
      return res.status(400).json({ error: "Tasks can only be assigned to users with role EXECUTIVE." });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        createdById: req.user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update task completion status
export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return res.status(400).json({
      error: "Invalid status. Allowed values: PENDING, IN_PROGRESS, COMPLETED.",
    });
  }

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (req.user.role === "EXECUTIVE" && task.assignedToId !== req.user.id) {
      return res.status(403).json({ error: "You can only update tasks assigned to yourself." });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    return res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};