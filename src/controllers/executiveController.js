import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// List all users with role EXECUTIVE and their assigned tasks
export const getExecutives = async (req, res) => {
  try {
    const executives = await prisma.user.findMany({
      where: { role: "EXECUTIVE" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        assignedTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, count: executives.length, data: executives });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Promote or demote user: USER <-> EXECUTIVE (Admin only)
export const updateRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !["USER", "EXECUTIVE"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'USER' or 'EXECUTIVE'." });
  }

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (targetUser.role === "ADMIN") {
      return res.status(403).json({ error: "Admin roles cannot be modified through this endpoint." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// View specific executive's assigned tasks
export const getExecutiveTasks = async (req, res) => {
  const { userId } = req.params;

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return res.status(404).json({ error: "Executive not found" });
    }

    const tasks = await prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};