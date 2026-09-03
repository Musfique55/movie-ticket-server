import { OAuth2Client } from "google-auth-library";
import { envVars } from "./envVars";

export const oauthClient = new OAuth2Client({
  clientId: envVars.googleClientId,
  clientSecret: envVars.googleSecret,
  redirectUri: envVars.googleRedirectUrl,
});
