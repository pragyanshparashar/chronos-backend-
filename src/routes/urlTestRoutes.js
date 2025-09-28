// src/routes/urlTestRoutes.js
import express from "express";
import Url from "../models/Url.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { urlSchema } from "../validators/urlValidators.js";
import { sendEmail } from "../utils/sendEmail.js"; // Import sendEmail

const router = express.Router();

// Public routes
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the URL Test API!",
    availableRoutes: [
      { method: "GET", path: "/test", description: "Check if router is working" },
      { method: "POST", path: "/create", description: "Create a new URL entry" },
      { method: "GET", path: "/all", description: "Get all URL entries" },
      { method: "PUT", path: "/update/:id", description: "Update a URL entry" },
      { method: "DELETE", path: "/delete/:id", description: "Delete a URL entry" }
    ],
    timestamp: new Date().toISOString(),
  });
});

router.get("/test", (req, res) => {
  res.json({ message: "urlTestRoutes router is working!" });
});

//  Protected routes

// CREATE URL with validation & email notification
router.post("/create", protect, validateRequest(urlSchema), async (req, res) => {
  const { originalUrl, shortUrl } = req.body;
  try {
    const newUrl = await Url.create({ originalUrl, shortUrl, user: req.user._id });

    // Send email notification to user
    await sendEmail({
      to: req.user.email,
      subject: "URL Created Successfully",
      text: `Your URL has been created:\nOriginal: ${originalUrl}\nShort: ${shortUrl}`,
      html: `<p>Your URL has been created:</p><ul><li>Original: ${originalUrl}</li><li>Short: ${shortUrl}</li></ul>`
    });

    res.status(201).json({ success: true, data: newUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all URLs for logged-in user
router.get("/all", protect, async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id });
    res.json({ success: true, data: urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE URL with email notification
router.put("/update/:id", protect, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ error: "URL not found" });

    if (url.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    url.originalUrl = req.body.originalUrl || url.originalUrl;
    url.shortUrl = req.body.shortUrl || url.shortUrl;
    await url.save();

    // Send email notification to user
    await sendEmail({
      to: req.user.email,
      subject: "URL Updated Successfully",
      text: `Your URL has been updated:\nOriginal: ${url.originalUrl}\nShort: ${url.shortUrl}`,
      html: `<p>Your URL has been updated:</p><ul><li>Original: ${url.originalUrl}</li><li>Short: ${url.shortUrl}</li></ul>`
    });

    res.json({ success: true, data: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE URL
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ error: "URL not found" });

    if (url.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await url.remove();
    res.json({ success: true, message: "URL deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;




