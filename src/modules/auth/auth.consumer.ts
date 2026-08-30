import redisClient from "@/config/redis";
import { receiveFromQueue } from "@/lib/queue";
import { sendEmail } from "@/utils/sendEmail";

export const initAuthConsumer = async () => {
  await receiveFromQueue(
    "email_verification_queue",
    "email_verification_exchange",
    "email_verification_queue",
    async (message: { email: string; hashedCode: string; code: string }) => {
      const key = `otp:${message.email}`;

      await redisClient.set(key, message.hashedCode, "EX", 600); // 10 minutes

      await sendEmail({
        to: message.email,
        subject: "Email Verification",
        html: `
            <h1>Email Verification</h1>
            <p>This is your verification code: <strong>${message.code}</strong></p>
            `,
      });
    },
  );
};

initAuthConsumer().catch((err) => {
  console.log(err);
});
