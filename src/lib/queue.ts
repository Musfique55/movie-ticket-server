import { getRabbitMqChannel } from "@/config/getRabbitMqChannel";

export const sendToQueue = async (
  queue: string,
  exchange: string,
  message: string,
) => {
  try {
    const channel = await getRabbitMqChannel();
    await channel.assertExchange(exchange, "direct", { durable: true });
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
    const q = await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(q.queue, exchange, routingKey);

    channel.consume(q.queue, async (msg) => {
      if (msg) {
        try {
          const parsedMessage = JSON.parse(msg.content.toString());
          await onMessage(parsedMessage);
          channel.ack(msg);
        } catch (error) {
          console.error("❌ [Consumer Error]", error);
          channel.nack(msg, false, true); // Requeue message on failure
        }
      }
    });

    channel.once("close", (err) => {
      if (err) console.warn(err.message);
      setTimeout(
        () => receiveFromQueue(queue, exchange, routingKey, onMessage),
        5000,
      );
    });
  } catch (error: any) {
    console.warn(error);
  }
};
