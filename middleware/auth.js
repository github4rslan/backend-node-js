const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Check if user is logged in
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

// ✅ Check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Admins only" });
  }
};

module.exports = { authMiddleware, adminMiddleware };
