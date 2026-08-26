import app from "@/app";
import { envVars } from "@/config/envVars";
import { prisma } from "@/lib/prisma";
import "@/events/onKeyExpire";
import "@/modules/reservation/reservation.consumer";
import "@/modules/payment/payment.consumer";

const PORT = envVars.port || 4000;

const bootStrap = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    await prisma.$connect();
  } catch (error) {
    console.log(error, "Error while bootstrapping server");
    prisma.$disconnect();
    process.exit(1);
  }
};

bootStrap();
