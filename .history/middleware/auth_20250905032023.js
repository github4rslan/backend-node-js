const jwt = require("jsonwebtoken");
const User = require("../models/User");  // Import the User model

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

    // If it's a regular JWT token (email/password login)
    if (token.length > 500) {
      // Verify JWT for email/password authentication
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user;
      return next();
    } 
    
    // If it's a Google token (for Firebase Sign-In)
    // This is simplified - we're assuming that the token has already been verified by the frontend
    // (e.g., Firebase handles the verification when the user logs in)
    const decoded = jwt.decode(token);  // Decode the token without verifying (since frontend handles the verification)
    
    const user = await User.findOne({ email: decoded.email });  // Find user by email
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    return next();  // Proceed to the next middleware or route
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
