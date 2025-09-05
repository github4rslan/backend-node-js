// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔽 add these two lines
const admin = require("../firebaseAdmin");          // verifies Firebase ID tokens
const { sendWelcomeEmail } = require("../mailer");  // sends the email

const router = express.Router();

/* =========================
   REGISTER (no changes)
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
   LOGIN (no changes)
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

/* ===========================================
   GOOGLE SIGN-IN → ALWAYS SEND WELCOME EMAIL
   Frontend should POST to: /api/auth/google-signin
=========================================== */
router.post("/google-signin", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    // 1) Verify Firebase ID token (from your React app)
    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = decoded.email;
    const name = decoded.name || email;

    if (!email) return res.status(400).json({ error: "No email in Google token" });

    // 2) (Optional) You can upsert the user if you want.
    //    For your "keep it simple" request, we skip DB work.

    // 3) ALWAYS send the welcome email on every Google login
    try {
      await sendWelcomeEmail({ to: email, name });
    } catch (mailErr) {
      console.error("Welcome email failed:", mailErr.message);
      // We don't block login if email fails
    }

    return res.json({ success: true, message: "Login OK, welcome email sent." });
  } catch (err) {
    console.error("google-signin error:", err);
    return res.status(401).json({ error: "Invalid or expired Google token" });
  }
});

module.exports = router;
