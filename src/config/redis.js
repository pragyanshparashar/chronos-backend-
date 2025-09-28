import { createClient } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || (process.env.DOCKER === "true" ? "chronos-redis" : "127.0.0.1");
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = createClient({
  socket: { host: REDIS_HOST, port: REDIS_PORT },
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on("error", (err) => {
  console.error(" Redis Client Error", err);
});

client.connect()
  .then(() => console.log(" Redis Connected Successfully"))
  .catch((err) => console.error(" Redis Connection Failed", err));

export default client;

