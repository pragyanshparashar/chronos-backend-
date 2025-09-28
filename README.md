Chronos Backend

Chronos is a backend system built with Node.js, Express, MongoDB, and Redis, supporting user authentication, job scheduling, URL management, and background job processing.

Features

User Authentication: Register, login, update profile, and access protected routes.

Job Scheduling: Create one-time or recurring jobs, processed by a background worker.

URL Management: Create, update, and delete URL entries with optional email notifications.

MongoDB & Redis: Persistent storage for data and caching.

Health Checks: API endpoint to verify backend, MongoDB, and Redis status.

Tech Stack

Node.js & Express

MongoDB & Mongoose

Redis & BullMQ (job queue)

JWT for authentication

Nodemailer for emails

Docker & Docker Compose

// Demo change to generate PR