const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in environment variables.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
