import "dotenv/config";
const envs = [
  "PORT",
  "DATABASE_URL",
  "NODE_ENV",
  "REDIS_URL",
  "FRONTEND_URL",
  "RABBITMQ_URL",
  "JWT_SECRET",
  "RESEND_SECRET",
  "RESEND_EMAIL",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_SECRET_KEY",
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
    rabbitmqUrl: string;
    jwtSecret: string;
    resendSecret: string;
    stripeWebhookSecret: string;
    stripeSecretKey: string;
    frontendUrl: string;
  } = {
    port: process.env.PORT!,
    databaseUrl: process.env.DATABASE_URL!,
    nodeEnv: process.env.NODE_ENV!,
    redisUrl: process.env.REDIS_URL!,
    resendEmail: process.env.RESEND_EMAIL!,
    rabbitmqUrl: process.env.RABBITMQ_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    resendSecret: process.env.RESEND_SECRET!,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    frontendUrl: process.env.FRONTEND_URL!,
  };

  return value;
};

export const envVars = loadEnvs();
