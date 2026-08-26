import Stripe from "stripe";
import { envVars } from "./envVars";

const stripeInstance = new Stripe(envVars.stripeSecretKey as string);

export const stripe = stripeInstance;
