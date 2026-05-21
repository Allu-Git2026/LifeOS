import express from "express";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} from "../controllers/habitController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.put("/:id", protect, updateHabit);
router.delete("/:id", protect, deleteHabit);

export default router;