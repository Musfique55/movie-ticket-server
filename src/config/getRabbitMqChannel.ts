import amqlib, { Channel } from "amqplib";
import { envVars } from "./envVars";

let connection = null;
let channel: Channel | null = null;

export const getRabbitMqChannel = async (): Promise<Channel> => {
  if (channel) {
    return channel;
  }

  try {
    connection = await amqlib.connect(
      envVars.rabbitmqUrl || "amqp://localhost",
    );

    connection.on("error", () => {
      connection = null;
      channel = null;
    });

    connection.on("close", () => {
      connection = null;
      channel = null;
    });

    channel = await connection.createChannel();

    channel.on("error", () => {
      channel = null;
    });

    channel.on("close", () => {
      channel = null;
    });

    return channel;
  } catch (error) {
    connection = null;
    channel = null;
    throw error;
  }
};
