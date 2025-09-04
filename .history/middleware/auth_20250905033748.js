const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Check if user is logged in
const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Support "Bearer <token>" format
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Token is not valid or expired" });
  }
};

// ✅ Check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied: Admins only" });
};

// ✅ Optional: middleware for any role
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: `Access denied: Requires role ${roles.join(", ")}` });
  };
};

module.exports = { authMiddleware, adminMiddleware, roleMiddleware };
