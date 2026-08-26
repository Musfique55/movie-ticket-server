import { catchAsync } from "@/helper/catchAsync";
import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "@/config/stripe";
import { envVars } from "@/config/envVars";
import AppError from "@/helper/AppError";
import { paymentServices } from "./payment.services";
import { sendResponse } from "@/helper/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentServices.createCheckoutSession(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  if (!signature) {
    throw new AppError("Signature is required", 400);
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      envVars.stripeWebhookSecret,
    );
  } catch (error) {
    throw new AppError("Invalid webhook signature", 500);
  }

  const result = await paymentServices.stripeWebhook(event);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stripe webhook processed successfully",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
};
