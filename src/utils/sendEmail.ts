import { envVars } from "@/config/envVars";
import { resendInstance } from "@/config/resend";
interface EmailOptions {
  to: string;
  subject: string;
  attachment?: Buffer;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  attachment,
  html,
}: EmailOptions) => {
  try {
    await resendInstance.emails.send({
      from: envVars.resendEmail,
      to,
      subject,
      attachments: attachment
        ? [
            {
              filename: "ticket.pdf",
              content: attachment,
            },
          ]
        : [],
      html,
    });
  } catch (error) {
    console.log(error);
  }
};
