
export async function processJob(job) {
  console.log(` Processing job: ${job.name} (${job.id})`);

  // Example execution logic
  if (job.data.type === "one-time") {
    console.log(`⏳ Running one-time job: ${job.data.title}`);
  } else if (job.data.type === "recurring") {
    console.log(` Running recurring job: ${job.data.title}`);
  }

  // Simulate random failure for retry testing
  if (Math.random() < 0.3) {
    throw new Error("Random job failure (for retry test)");
  }

  console.log(` Job completed: ${job.data.title}`);
}
