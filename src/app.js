
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import redisClient from "./config/redis.js";

import urlTestRoutes from "./routes/urlTestRoutes.js";
import mongoTestRoutes from "./routes/mongoTestRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware - Order matters!
app.use(cors());
app.use(express.json()); // parse JSON FIRST

//  DEBUGGING MIDDLEWARE - Must be early in the chain
app.use((req, res, next) => {
  console.log(`🔍 [DEBUG] ${req.method} ${req.originalUrl}`);
  console.log(`🔍 [DEBUG] Content-Type: ${req.headers['content-type'] || 'none'}`);
  console.log(`🔍 [DEBUG] Body:`, req.body);
  console.log('---');
  next();
});

app.use(morgan("dev")); // Morgan AFTER our debugging

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Chronos Backend is running!");
});

// Health check route
// Health check route
app.get("/api/health", async (req, res) => {
  const health = {
    uptime: process.uptime(),
    mongo: mongoose.connection.readyState === 1 ? "Connected" : " Disconnected",
    redis: redisClient.isOpen ? " Connected" : " Disconnected",
    timestamp: new Date(),
  };
  res.status(200).json(health);
});


// Temporary test route to check POST
app.post("/test-post", (req, res) => {
  console.log(" POST /test-post route hit!");
  console.log("Body received:", req.body);
  res.json({ ok: true, body: req.body, message: "test-post route working!" });
});

// Routes
console.log(" Mounting routes...");
app.use("/api/url-test", urlTestRoutes);
app.use("/api/mongo-test", mongoTestRoutes);
app.use("/api/test", testRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
console.log("All routes mounted");

// 404 handler
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;

