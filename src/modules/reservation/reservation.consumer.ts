import redisClient from "@/config/redis";
import { receiveFromQueue } from "@/lib/queue";

export const initReservationConsumer = async () => {
  await receiveFromQueue(
    "reservation_queue",
    "reservation_exchange",
    "reservation_queue",
    async (message: { reservationId: string; expiresAt: string | Date }) => {
      const key = `lock:reservation:${message.reservationId}`;
      const ttlSeconds = Math.max(
        1,
        Math.floor((new Date(message.expiresAt).getTime() - Date.now()) / 1000),
      );
      await redisClient.set(key, JSON.stringify(message), "EX", ttlSeconds);
    },
  );
};
