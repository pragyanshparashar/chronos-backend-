
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Job from "../models/jobModel.js";
import { Worker } from "bullmq";

dotenv.config();

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Redis connection
const redisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
};

// Worker to process jobs
const worker = new Worker(
  "jobQueue",
  async (job) => {
    try {
      console.log(`Processing Job: ${job.data.jobId}, Title: ${job.data.title}`);

      const dbJob = await Job.findById(job.data.jobId);
      if (!dbJob) throw new Error("Job not found in DB");

      // Simulate job execution
      console.log(`Executing job "${dbJob.title}"...`);
      dbJob.status = "completed";
      await dbJob.save();

      console.log(`Job "${dbJob.title}" completed successfully ✅`);
    } catch (error) {
      console.error(`Job failed: ${error.message}`);

      // Send email notification
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Job Failed: ${job.data.title}`,
        text: `Job ID: ${job.data.jobId}\nError: ${error.message}`,
      });

      const dbJob = await Job.findById(job.data.jobId);
      if (dbJob) {
        dbJob.status = "failed";
        await dbJob.save();
      }

      throw error; // let BullMQ retry
    }
  },
  {
    connection: redisConnection,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  }
);

worker.on("completed", (job) => console.log(` Job completed: ${job.id}`));
worker.on("failed", (job, err) =>
  console.log(`Job failed: ${job.id} | Reason: ${err.message}`)
);

// Graceful shutdown
process.on("SIGTERM", async () => await worker.close());
process.on("SIGINT", async () => await worker.close());

console.log("🚀Job Worker running...");










