
import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js"; // ✅ Correct middleware import
import Joi from "joi";

const router = express.Router();

//  Joi Schemas 
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 50 characters"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  }),
});

//  Public routes with validation 
router.post("/register", validateRequest(registerSchema), registerUser); // POST /api/auth/register
router.post("/login", validateRequest(loginSchema), loginUser); // POST /api/auth/login

//Protected routes 
router.get("/profile", protect, getProfile); // GET /api/auth/profile
router.put("/profile", protect, updateProfile); // PUT /api/auth/profile

// Example protected route 
router.get("/protected-route", protect, (req, res) => {
  res.json({
    success: true,
    message: "You have accessed a protected route!",
    user: req.user, // Logged-in user's info
  });
});

export default router;


