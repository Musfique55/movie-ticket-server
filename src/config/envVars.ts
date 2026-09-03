import "dotenv/config";
const envs = [
  "PORT",
  "DATABASE_URL",
  "NODE_ENV",
  "REDIS_URL",
  "REDIS_HOST",
  "REDIS_PORT",
  "FRONTEND_URL",
  "RABBITMQ_URL",
  "JWT_SECRET",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",
  "RESEND_SECRET",
  "RESEND_EMAIL",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_SECRET_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_SECRET",
  "GOOGLE_REDIRECT_URL",
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
    redisHost: string;
    redisPort: string;
    resendEmail: string;
    rabbitmqUrl: string;
    jwtSecret: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
    resendSecret: string;
    stripeWebhookSecret: string;
    stripeSecretKey: string;
    frontendUrl: string;
    googleClientId: string;
    googleSecret: string;
    googleRedirectUrl: string;
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
    redisHost: process.env.REDIS_HOST!,
    redisPort: process.env.REDIS_PORT!,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN!,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN!,
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleSecret: process.env.GOOGLE_SECRET!,
    googleRedirectUrl: process.env.GOOGLE_REDIRECT_URL!,
  };

  return value;
};

export const envVars = loadEnvs();
