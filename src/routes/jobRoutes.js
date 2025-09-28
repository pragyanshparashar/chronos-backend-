
import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All job routes are protected (require a valid JWT)
router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;


