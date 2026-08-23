import "dotenv/config";
const envs = [
  "PORT",
  "DATABASE_URL",
  "NODE_ENV",
  "REDIS_URL",
  // "REDIS_HOST",
  // "REDIS_PORT",
  "RABBITMQ_URL",
  "JWT_SECRET",
  "RESEND_SECRET",
  "RESEND_EMAIL",
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
    resendEmail: string;
    // redisHost: string;
    // redisPort: string;
    rabbitmqUrl: string;
    jwtSecret: string;
    resendSecret: string;
  } = {
    port: process.env.PORT!,
    databaseUrl: process.env.DATABASE_URL!,
    nodeEnv: process.env.NODE_ENV!,
    redisUrl: process.env.REDIS_URL!,
    resendEmail: process.env.RESEND_EMAIL!,
    // redisHost: process.env.REDIS_HOST!,
    // redisPort: process.env.REDIS_PORT!,
    rabbitmqUrl: process.env.RABBITMQ_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    resendSecret: process.env.RESEND_SECRET!,
  };

  return value;
};

export const envVars = loadEnvs();
