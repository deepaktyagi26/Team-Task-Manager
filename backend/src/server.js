require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// app.use(cors());
app.use(cors({
  origin: "https://team-task-manager-15luht36t-deepaktyagi57731-6701s-projects.vercel.app", 
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes); // Mounted at /api because it handles both /projects/:projectId/tasks and /tasks/:id

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (Bound to 0.0.0.0)`);
});

