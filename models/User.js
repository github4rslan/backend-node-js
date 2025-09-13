const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Basic Profile
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Wallet & Betting
    balance: { type: Number, default: 0 }, // current balance in PKR
    totalDeposits: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },

    // Betting stats
    totalBets: { type: Number, default: 0 },
    betsWon: { type: Number, default: 0 },
    betsLost: { type: Number, default: 0 },
    biggestWin: { type: Number, default: 0 },

    // Payment & Verification
    phone: { type: String }, // for Easypaisa/JazzCash
    isVerified: { type: Boolean, default: false }, // payment/account verification

    gameHistory: [
  {
    event: String,
    number: Number,
    result: String, // "Won" or "Lost"
    amount: Number,
    time: { type: Date, default: Date.now },
  },
],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
