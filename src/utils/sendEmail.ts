import { envVars } from "@/config/envVars";
import { resendInstance } from "@/config/resend";
import { EmailType } from "@/generated/prisma/client";
import { EmailServices } from "@/modules/email/email.services";
interface EmailOptions {
  to: string;
  subject: string;
  attachment?: Buffer;
  html: string;
  type: EmailType;
}

export const sendEmail = async ({
  to,
  subject,
  attachment,
  html,
  type,
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

    // log in db
    await EmailServices.emailLogger({
      to,
      subject,
      from: envVars.resendEmail,
      text: html,
      type,
    });
  } catch (error) {
    console.log(error);
  }
};
