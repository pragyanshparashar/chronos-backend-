
import express from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`🔥 TEST: ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Test app working!" });
});

app.post("/test", (req, res) => {
  res.json({ message: "Test POST working!" });
});

export default app;