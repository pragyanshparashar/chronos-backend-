
import Job from "../models/jobModel.js";
import { jobQueue } from "../jobs/jobQueue.js"; 



// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, type = "one-time", scheduleTime, recurrence } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Save job to DB first
    const job = await Job.create({
      user: req.user._id,
      title,
      description,
      type,
      scheduleTime: scheduleTime ? new Date(scheduleTime) : undefined,
      recurrence,
      status: "pending",
    });

    //  data sent to the worker
    const payload = {
      jobId: job._id.toString(),
      userId: req.user._id,
      title: job.title,
      description: job.description,
      type: job.type,
      scheduleTime: job.scheduleTime,
      recurrence: job.recurrence,
    };

    // Schedule in BullMQ
    if (type === "one-time") {
      if (scheduleTime) {
        const date = new Date(scheduleTime);
        const delay = Math.max(0, date.getTime() - Date.now());
        await jobQueue.add("job", payload, {
          delay,
          jobId: job._id.toString(),
        });
      } else {
       
        await jobQueue.add("job", payload, {
          jobId: job._id.toString(),
        });
      }
    } else if (type === "recurring" && recurrence) {
   
      await jobQueue.add("job", payload, {
        repeat: { cron: recurrence },
        jobId: job._id.toString(),
      });
    }

    return res.status(201).json(job);
  } catch (err) {
    console.error("createJob error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all jobs for logged-in user
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (err) {
    console.error("getJobs error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a specific job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (err) {
    console.error("getJobById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a job (and reschedule in queue)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.title = req.body.title ?? job.title;
    job.description = req.body.description ?? job.description;
    job.type = req.body.type ?? job.type;
    job.scheduleTime = req.body.scheduleTime ? new Date(req.body.scheduleTime) : job.scheduleTime;
    job.recurrence = req.body.recurrence ?? job.recurrence;
    job.status = req.body.status ?? job.status;

    const updatedJob = await job.save();

    // attempt to remove any existing queued jobs with same id to avoid duplicates
    try {
      await jobQueue.removeJobs(updatedJob._id.toString());
    } catch (e) {
      // ignore removal errors but log them
      console.warn("Warning: removeJobs error (update):", e.message);
    }

    // re-add to queue with new schedule (same logic as creation)
    const payload = {
      jobId: updatedJob._id.toString(),
      userId: req.user._id,
      title: updatedJob.title,
      description: updatedJob.description,
      type: updatedJob.type,
      scheduleTime: updatedJob.scheduleTime,
      recurrence: updatedJob.recurrence,
    };

    if (updatedJob.type === "one-time") {
      if (updatedJob.scheduleTime && updatedJob.scheduleTime > new Date()) {
        const delay = Math.max(0, new Date(updatedJob.scheduleTime).getTime() - Date.now());
        await jobQueue.add("job", payload, { delay, jobId: updatedJob._id.toString() });
      } else {
        await jobQueue.add("job", payload, { jobId: updatedJob._id.toString() });
      }
    } else if (updatedJob.type === "recurring" && updatedJob.recurrence) {
      await jobQueue.add("job", payload, { repeat: { cron: updatedJob.recurrence }, jobId: updatedJob._id.toString() });
    }

    return res.json(updatedJob);
  } catch (err) {
    console.error("updateJob error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });

   
    try {
      await jobQueue.removeJobs(job._id.toString());
    } catch (e) {
      console.warn("Warning: removeJobs error (delete):", e.message);
    }

    return res.json({ message: "Job deleted successfully (DB + Queue attempted removal)" });
  } catch (err) {
    console.error("deleteJob error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

