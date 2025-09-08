const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // <-- This line is crucial to parse JSON bodies!

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const taskRoutes = require("./routes/task");
app.use("/api/tasks", taskRoutes);
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);
const tiktokRoutes = require("./routes/tiktok");
app.use("/api/tiktok", tiktokRoutes);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
