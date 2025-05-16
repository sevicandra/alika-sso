import { createClient } from "redis";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: `redis://${process.env.REDIS_HOST || "localhost"}:${
    process.env.REDIS_PORT || 6379
  }`,
  password: process.env.REDIS_PASSWORD_FILE
    ? fs.readFileSync(process.env.REDIS_PASSWORD_FILE, "utf8").trim()
    : process.env.REDIS_PASSWORD || "",
  database: 0,
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default client;
