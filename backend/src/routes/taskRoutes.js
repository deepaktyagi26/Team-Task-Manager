const express = require("express");
const prisma = require("../db");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// Get tasks for a specific project
router.get("/projects/:projectId/tasks", authenticate, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: req.params.projectId },
      include: { assignedTo: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a new task (Admin only)
router.post("/projects/:projectId/tasks", authenticate, requireRole("ADMIN"), async (req, res) => {
  try {
    const { title, description, assignedToId, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        projectId: req.params.projectId,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update task status (Admin or Assigned User)
router.patch("/tasks/:id", authenticate, async (req, res) => {
  try {
    const { status, assignedToId, title, description, dueDate } = req.body;
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Allow Admin to update anything, but Member can only update status if assigned
    if (req.user.role === "MEMBER") {
      if (task.assignedToId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: You can only update your own assigned tasks." });
      }
      // Member can only update status
      const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: { status }
      });
      return res.json(updatedTask);
    }

    // Admin update
    const dataToUpdate = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (assignedToId !== undefined) dataToUpdate.assignedToId = assignedToId;
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (dueDate !== undefined) dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a task (Admin only)
router.delete("/tasks/:id", authenticate, requireRole("ADMIN"), async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user's dashboard tasks
router.get("/my-dashboard", authenticate, async (req, res) => {
  try {
    const myTasks = await prisma.task.findMany({
      where: { assignedToId: req.user.id },
      include: { project: { select: { name: true } } },
      orderBy: { dueDate: 'asc' }
    });
    
    // Also fetch counts
    const counts = {
      todo: myTasks.filter(t => t.status === 'TODO').length,
      inProgress: myTasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: myTasks.filter(t => t.status === 'DONE').length,
      overdue: myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length
    };

    res.json({ tasks: myTasks, counts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
