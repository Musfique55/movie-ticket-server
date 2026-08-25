import { getRabbitMqChannel } from "@/config/getRabbitMqChannel";

const RETRY_LIMIT = 5;
const RETRY_DELAY_MS = 5000;

export const sendToQueue = async (
  queue: string,
  exchange: string,
  message: string,
) => {
  try {
    const channel = await getRabbitMqChannel();
    await channel.assertExchange(exchange, "direct", { durable: true });
    channel.prefetch(1);
    await channel.assertQueue(queue, { durable: true });
    channel.publish(exchange, queue, Buffer.from(message), {
      persistent: true,
    });
  } catch (error: any) {
    console.warn(error.message);
  }
};

export const receiveFromQueue = async (
  queue: string,
  exchange: string,
  routingKey: string,
  onMessage: (message: any) => Promise<void> | void,
) => {
  try {
    const channel = await getRabbitMqChannel();
    await channel.assertExchange(exchange, "direct", { durable: true });
    channel.prefetch(1);
    const q = await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(q.queue, exchange, routingKey);

    channel.consume(q.queue, async (msg) => {
      if (msg) {
        try {
          const parsedMessage = JSON.parse(msg.content.toString());
          await onMessage(parsedMessage);
          channel.ack(msg);
        } catch (error) {
          const headers = msg.properties.headers || {};
          const retryCount = Number(headers["x-death"] || 0);

          if (retryCount < RETRY_LIMIT) {
            console.warn(
              `Retrying message (${retryCount + 1}/${RETRY_LIMIT}) in ${RETRY_DELAY_MS / 1000} seconds...`,
            );

            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

            channel.publish(exchange, routingKey, msg.content, {
              ...msg.properties,
              headers: {
                ...headers,
                "x-death": (retryCount + 1).toString(),
              },
            });

            channel.ack(msg);
          } else {
            console.error(`exceeds retry count for queue ${queue}`, error);
            channel.nack(msg, false, false);
          }
        }
      }
    });
  } catch (error: any) {
    console.warn(error);
  }
};
