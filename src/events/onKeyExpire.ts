import { envVars } from "@/config/envVars";
import { ReservationServices } from "@/modules/reservation/reservation.services";
import { Redis } from "ioredis";

const redisClient = new Redis(envVars.redisUrl);
const CHANNEL_KEY = "__keyevent@0__:expired";
const expiredSeatsBuffer = new Map<string, Set<string>>();
let batchTimer: NodeJS.Timeout | null = null;
const BATCH_DELAY_MS = 100;

redisClient.config("SET", "notify-keyspace-events", "Ex");

redisClient.subscribe(CHANNEL_KEY);

redisClient.on("message", async (ch, message) => {
  if (ch === CHANNEL_KEY && message.startsWith("lock:showSeat")) {
    const parts = message.split(":");
    const seatId = parts[4] as string;
    const showTimeId = parts[2] as string;

    if (showTimeId && seatId) {
      if (!expiredSeatsBuffer.has(showTimeId)) {
        expiredSeatsBuffer.set(showTimeId, new Set());
      }

      expiredSeatsBuffer.get(showTimeId)!.add(seatId);
    }

    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(flushBuffer, BATCH_DELAY_MS);
  }
});

const flushBuffer = async () => {
  const currentBuffer = new Map(expiredSeatsBuffer);
  expiredSeatsBuffer.clear();
  batchTimer = null;

  for (const [showTimeId, showSeatIds] of currentBuffer.entries()) {
    const seatIds = Array.from(showSeatIds);
    if (seatIds.length > 0) {
      await ReservationServices.unlockSeat(seatIds, showTimeId);
    }
  }
};
