// server.js
import dotenv from "dotenv";
dotenv.config(); //  Load environment variables first

import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/redis.js"; //  Initializes Redis client
import healthRoutes from "./routes/health.js";

// Routes
app.use("/health", healthRoutes);

// Connect MongoDB
connectDB();

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
