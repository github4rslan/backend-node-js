const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: { type: String },  // Add photoURL to store user's profile picture
    uid: { type: String, required: true, unique: true },  // Add uid for Firebase user ID
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Set default role as user
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
