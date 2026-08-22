import "dotenv/config";
const envs = [
  "PORT",
  "DATABASE_URL",
  "NODE_ENV",
  "REDIS_URL",
  // "REDIS_HOST",
  // "REDIS_PORT",
  "RABBITMQ_URL",
];

const loadEnvs = () => {
  for (const env of envs) {
    if (!process.env[env]) {
      throw new Error(`Missing environment variable: ${env}`);
    }
  }

  const value: {
    port: string;
    databaseUrl: string;
    nodeEnv: string;
    redisUrl: string;
    // redisHost: string;
    // redisPort: string;
    rabbitmqUrl: string;
  } = {
    port: process.env.PORT!,
    databaseUrl: process.env.DATABASE_URL!,
    nodeEnv: process.env.NODE_ENV!,
    redisUrl: process.env.REDIS_URL!,
    // redisHost: process.env.REDIS_HOST!,
    // redisPort: process.env.REDIS_PORT!,
    rabbitmqUrl: process.env.RABBITMQ_URL!,
  };

  return value;
};

export const envVars = loadEnvs();
