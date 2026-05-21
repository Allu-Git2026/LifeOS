import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Habit title is required" });
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        userId: req.userId as string,
      },
    });

    res.status(201).json({
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHabits = async (req: AuthRequest, res: Response) => {
  try {
    const habits = await prisma.habit.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Habits fetched successfully",
      habits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateHabit = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, completed } = req.body;

    const existingHabit = await prisma.habit.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: {
        title,
        completed,
      },
    });

    res.status(200).json({
      message: "Habit updated successfully",
      habit: updatedHabit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingHabit = await prisma.habit.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await prisma.habit.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};