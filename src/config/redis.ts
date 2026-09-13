import Redis from "ioredis";
import { envVars } from "./envVars";

const redisClient = new Redis(envVars.redisUrl);

const scanAndDeleteKeys = async (pattern: string) => {
  const stream = redisClient.scanStream({
    match: pattern,
    count: 100,
  });

  for await (const keys of stream) {
    if (keys.length) {
      await redisClient.del(...keys);
    }
  }
};

export { redisClient, scanAndDeleteKeys };
