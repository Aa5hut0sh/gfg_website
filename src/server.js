import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import executiveRoutes from "./routes/executiveRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/executives", executiveRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});