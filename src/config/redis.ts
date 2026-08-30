import Redis from "ioredis";
import { envVars } from "./envVars";

const redisClient = new Redis({
  host: envVars.redisHost,
  port: parseInt(envVars.redisPort),
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});
redisClient.on("error", (err) => console.log(err));

export default redisClient;
