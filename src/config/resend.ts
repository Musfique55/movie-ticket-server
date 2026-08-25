import "dotenv/config";
import { Resend } from "resend";
import { envVars } from "./envVars";

export const resendInstance = new Resend(envVars.resendSecret!);
