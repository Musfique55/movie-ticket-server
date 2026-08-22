import Redis from "ioredis";
import { envVars } from "./envVars";

const redisClient = new Redis(envVars.redisUrl);
redisClient.on("connect", () => console.log("✅ Redis connected successfully"));

export default redisClient;
