import Redis from "ioredis";
import { envVars } from "./envVars";

// const redisClient = new Redis({
//   host: envVars.redisHost,
//   port: parseInt(envVars.redisPort),
// });
const redisClient = new Redis(envVars.redisUrl);

export default redisClient;
