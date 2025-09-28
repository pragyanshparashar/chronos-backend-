// src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// helper: generate jwt
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      user: user.toJSON(),
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login User
// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    return res.json({
      user: user.toJSON(),
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Get Profile (Protected)
// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({ user: req.user });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Update Profile (Protected)
// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // pre-save hook will hash it
    }

    const updatedUser = await user.save();

    return res.json({
      user: updatedUser.toJSON(),
      token: generateToken(updatedUser._id),
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
