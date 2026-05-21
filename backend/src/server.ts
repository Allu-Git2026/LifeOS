import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import habitRoutes from "./routes/habitRoutes";
import noteRoutes from "./routes/noteRoutes";
import goalRoutes from "./routes/goalRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/goals", goalRoutes);

app.get("/", (req, res) => {
  res.send("LifeOS Backend is running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`LifeOS Backend running on http://localhost:${PORT}`);
});

