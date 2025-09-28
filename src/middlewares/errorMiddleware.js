// src/middleware/errorMiddleware.js

// Not Found handler (for unknown routes)
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Centralized Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error(" Error Handler:", err);

  // If statusCode was not set before, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // hide stack in prod
  });
};
