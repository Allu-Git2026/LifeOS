import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createGoal);
router.get("/", protect, getGoals);
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);

export default router;