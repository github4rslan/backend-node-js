// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Nodemailer helper
const { sendWelcomeEmail } = require("../server/mailer.js");

const router = express.Router();

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // default role = "user"
    const newUser = new User({ name, email, password: hashedPassword, role: "user" });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/email-login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    // Use your existing helper
    await sendWelcomeEmail({ to: email });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ email-login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ===========================================
   SIMPLE GOOGLE SIGN-IN → JUST SEND EMAIL
=========================================== */
router.post("/google-signin", async (req, res) => {
  try {
    const { email, name } = req.body; // frontend must send these

    if (!email) return res.status(400).json({ error: "Missing email" });

    // Always send welcome email
    try {
      await sendWelcomeEmail({ to: email, name });
      console.log("✅ Welcome email sent to:", email);
    } catch (mailErr) {
      console.error("❌ Welcome email failed:", mailErr.message);
    }

    res.json({ success: true, message: "Login OK, welcome email sent." });
  } catch (err) {
    console.error("❌ google-signin error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
