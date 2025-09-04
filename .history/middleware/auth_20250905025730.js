const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const User = require("../models/User");

// Initialize Firebase Admin SDK (Make sure you have initialized this in another file like firebaseAdmin.js)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../path/to/serviceAccountKey.json")), // Replace with your path
  });
}

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

    // If it's a Firebase token (Google Sign-In), verify it using Firebase Admin SDK
    if (token.length < 500) {
      // Token looks like a JWT from Firebase (Google Sign-In)
      const decoded = await admin.auth().verifyIdToken(token); // Verifying Firebase token

      // Attach user info from Firebase (we can access user.uid, name, email, etc.)
      const user = await User.findOne({ uid: decoded.uid });  // Find user in DB by Firebase UID

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user;
      next();  // Continue to the next middleware or route
    } else {
      // Otherwise, it's a standard JWT (email/password login)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify JWT

      // Attach user (without password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user;
      next();  // Continue to the next middleware or route
    }
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
