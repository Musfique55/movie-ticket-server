import { envVars } from "@/config/envVars";
import { resendInstance } from "@/config/resend";
interface EmailOptions {
  to: string;
  subject: string;
  attachment: Buffer;
}

export const sendEmail = async ({ to, subject, attachment }: EmailOptions) => {
  try {
    await resendInstance.emails.send({
      from: envVars.resendEmail,
      to,
      subject,
      attachments: [
        {
          filename: "ticket.pdf",
          content: attachment,
        },
      ],
      html: `<p>Here is your ticket</p>`,
    });
  } catch (error) {
    console.log(error);
  }
};
