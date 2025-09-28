import express from "express";
import redisClient from "../config/redis.js";


const router = express.Router();

// Redis test route
router.get("/cache", async (req, res) => {
  try {
    const cachedValue = await redisClient.get("test_key");

    if (cachedValue) {
      return res.json({
        source: "cache",
        value: cachedValue,
      });
    }

    // If not cached, set new value
    const newValue = "Hello from Redis at " + new Date().toISOString();
    await redisClient.setEx("test_key", 30, newValue); // expires in 30s

    return res.json({
      source: "newly_set",
      value: newValue,
    });
  } catch (error) {
    console.error("Redis Error:", error);
    res.status(500).json({ error: "Redis error" });
  }
});

export default router;
