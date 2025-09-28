import express from "express";
import mongoose from "mongoose";
import redisClient from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check Mongo
    const mongoState =
      mongoose.connection.readyState === 1 ? "ok" : "disconnected";

    // Check Redis
    let redisState = "disconnected";
    try {
      await redisClient.ping();
      redisState = "ok";
    } catch (err) {
      redisState = "error";
    }

    res.json({
      backend: "ok",
      mongo: mongoState,
      redis: redisState,
    });
  } catch (error) {
    res.status(500).json({
      error: "Health check failed",
      details: error.message,
    });
  }
});

export default router;
