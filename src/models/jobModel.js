
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["one-time", "recurring"],
      default: "one-time",
    },
    scheduleTime: {
      type: Date, 
    },
    recurrence: {
      type: String, 
    },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
