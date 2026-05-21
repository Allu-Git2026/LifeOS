import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, target } = req.body;

    if (!title || !target) {
      return res.status(400).json({ message: "Title and target are required" });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        target: Number(target),
        progress: 0,
        userId: req.userId as string,
      },
    });

    res.status(201).json({
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Goals fetched successfully",
      goals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, target, progress } = req.body;

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        target: target !== undefined ? Number(target) : undefined,
        progress: progress !== undefined ? Number(progress) : undefined,
      },
    });

    res.status(200).json({
      message: "Goal updated successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};