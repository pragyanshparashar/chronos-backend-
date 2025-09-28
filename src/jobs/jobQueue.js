
import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
};

export const jobQueue = new Queue("jobQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, 
    backoff: {
      type: "exponential",
      delay: 5000, 
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});



