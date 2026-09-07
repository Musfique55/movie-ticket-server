import { EmailType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const emailLogger = async ({
  to,
  subject,
  type,
  from,
  text,
}: {
  to: string;
  subject: string;
  type: EmailType;
  from: string;
  text: string;
}) => {
  try {
    const email = await prisma.email.create({
      data: {
        to,
        subject,
        body: text,
        type,
        from,
      },
    });
    return email;
  } catch (error) {
    throw error;
  }
};

export const EmailServices = { emailLogger };
