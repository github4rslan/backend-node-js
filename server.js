const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // To load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // This is crucial to parse JSON request bodies!

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

const covidRoutes = require("./routes/covid");
app.use("/api/covid", covidRoutes);

const whatsappRoutes = require("./routes/whatsapp");
app.use("/api/whatsapp", whatsappRoutes);

const twitterRoutes = require("./routes/twitter");
app.use("/api/twitter", twitterRoutes);

const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

// **Chatbot Route** - Import the chatbot route
const chatRoutes = require("./routes/chatrouter");  // Chatbot route
app.use("/api/chat", chatRoutes);  // Register the chatbot route
const web3Routes = require("./routes/web3");
app.use("/api/web3", web3Routes);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)  // Using environment variable for MongoDB URI
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
