const Redis = require("ioredis");


const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

connection.on("connect", () => console.log("Redis connected"));
connection.on("error", (e) => console.error("Redis error:", e.message));

module.exports = connection