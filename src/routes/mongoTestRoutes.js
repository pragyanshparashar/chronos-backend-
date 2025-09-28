
import express from "express";
import TestMongo from "../models/TestMongo.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Mongo Test API!",
    availableRoutes: [
      { method: "GET", path: "/test", description: "Check if router is working" },
      { method: "POST", path: "/create", description: "Create a new test document" },
      { method: "GET", path: "/all", description: "Get all test documents" },
      { method: "PUT", path: "/update/:id", description: "Update a test document by ID" },
      { method: "DELETE", path: "/delete/:id", description: "Delete a test document by ID" }
    ],
    timestamp: new Date().toISOString()
  });
});

router.get("/test", (req, res) => {
  res.json({ message: "MongoTest router is working!", timestamp: new Date().toISOString() });
});

// Create
router.post("/create", protect, async (req, res) => {
  const { name, value } = req.body;
  if (!name || value === undefined) return res.status(400).json({ error: "name and value are required" });

  try {
    const newDoc = await TestMongo.create({ name, value });
    res.status(201).json({ success: true, data: newDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all
router.get("/all", protect, async (req, res) => {
  try {
    const docs = await TestMongo.find();
    res.json({ success: true, data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update by ID
router.put("/update/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { name, value } = req.body;

  try {
    const updatedDoc = await TestMongo.findByIdAndUpdate(
      id,
      { name, value },
      { new: true, runValidators: true }
    );

    if (!updatedDoc) return res.status(404).json({ error: "Document not found" });

    res.json({ success: true, data: updatedDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete by ID
router.delete("/delete/:id", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await TestMongo.findByIdAndDelete(id);
    if (!deletedDoc) return res.status(404).json({ error: "Document not found" });

    res.json({ success: true, data: deletedDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

