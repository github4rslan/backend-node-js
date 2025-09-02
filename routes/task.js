const express = require("express");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to check token
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// CREATE task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.userId });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
});

// UPDATE task
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE task
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ success: true });
});

module.exports = router;
