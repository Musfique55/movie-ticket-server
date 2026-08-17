import app from "@/app";
import { envVars } from "@/config/envVars";
import { prisma } from "@/lib/prisma";

const PORT = envVars.port || 4000;
const bootStrap = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    prisma.$connect().then(() => console.log("Database connected"));
  } catch (error) {
    console.log(error, "Error while bootstrapping server");
    prisma.$disconnect();
    process.exit(1);
  }
};

bootStrap();
