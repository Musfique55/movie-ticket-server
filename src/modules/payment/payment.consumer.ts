import { receiveFromQueue } from "@/lib/queue";
import { paymentServices } from "./payment.services";
import Stripe from "stripe";

const initPaymentFulfillmentConsumer = async () => {
  await receiveFromQueue(
    "payment_fulfillment_queue",
    "payment_fulfillment_exchange",
    "payment_fulfillment_queue",
    async (message: {
      eventId: string;
      session: Stripe.Checkout.Session;
    }) => {
      await paymentServices.handlePaymentFulfillment(
        message.eventId,
        message.session,
      );
    },
  );
};

try {
  initPaymentFulfillmentConsumer();
} catch (error: any) {
  console.warn(
    "⚠️ RabbitMQ payment worker initialization skipped:",
    error.message,
  );
}
