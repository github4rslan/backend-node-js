const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const Payment = require("../models/Payment");

const router = express.Router();

// ✅ Mock checkout session (create payment)
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Save payment in DB
    const payment = new Payment({
      user: req.user.id,
      amount,
      status: "success",
    });
    await payment.save();

    res.json({ message: "Mock payment successful", id: payment._id });
  } catch (err) {
    console.error("❌ Payment Error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ Get payment history (for logged in user)
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin: get all payments
router.get("/all", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  const payments = await Payment.find().populate("user", "name email role").sort({ createdAt: -1 });
  res.json(payments);
});

module.exports = router;
