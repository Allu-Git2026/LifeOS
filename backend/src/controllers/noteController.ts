import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.userId as string,
      },
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    await prisma.note.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};