import "dotenv/config";
const envs = ["PORT", "DATABASE_URL", "NODE_ENV"];

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
  } = {
    port: process.env.PORT!,
    databaseUrl: process.env.DATABASE_URL!,
    nodeEnv: process.env.NODE_ENV!,
  };

  return value;
};

export const envVars = loadEnvs();
