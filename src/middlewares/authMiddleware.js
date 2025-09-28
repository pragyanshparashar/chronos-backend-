// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token = null;

  // Check if Authorization header exists: "Bearer <token>"
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user (excluding password) and attach to req
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

//  Optional role-based middleware
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
