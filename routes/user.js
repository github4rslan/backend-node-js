const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET user account details (safe, no password)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE user balance & stats (for bets, deposits, withdrawals)
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body; // e.g. { balance: 2000, totalDeposits: 5000 }
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Example: Deposit money
router.post("/:id/deposit", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.balance += amount;
    user.totalDeposits += amount;
    await user.save();

    res.json({ message: "Deposit successful", balance: user.balance });
  } catch (err) {
    console.error("Error in deposit:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// ✅ Example: Withdraw money
router.post("/:id/withdraw", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    user.balance -= amount;
    user.totalWithdrawals += amount;
    await user.save();

    res.json({ message: "Withdrawal successful", balance: user.balance });
  } catch (err) {
    console.error("Error in withdrawal:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update user balance and record game history
router.post("/update-balance", async (req, res) => {
  try {
    const { userId, amount, bet } = req.body;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Update balance
    user.balance = (user.balance || 0) + amount;

    // ✅ Update betting stats
    user.totalBets = (user.totalBets || 0) + 1;
    if (bet.status === "Won") {
      user.betsWon = (user.betsWon || 0) + 1;
      user.biggestWin = Math.max(user.biggestWin || 0, bet.amount);
    } else if (bet.status === "Lost") {
      user.betsLost = (user.betsLost || 0) + 1;
    }

    // ✅ Save proper game history with NET amount
    user.gameHistory = [
      {
        event: bet.event,
        number: bet.number,
        status: bet.status,     // "Won" or "Lost"
        amount: amount,         // ✅ this is +100 or -100
        time: new Date(),
      },
      ...(user.gameHistory || []),
    ].slice(0, 1000); // keep only last 20 games

    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Balance update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Deposit
router.post("/deposit", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.balance += amount;
    user.totalDeposits += amount;

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error("Deposit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Withdraw
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    user.balance -= amount;
    user.totalWithdrawals += amount;

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;
