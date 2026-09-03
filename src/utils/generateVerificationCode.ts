import crypto from "crypto";

export const generateVerificationCode = () => {
  const code = crypto.randomInt(0, 10000).toString().padStart(5, "0");
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  return { hashedCode, code };
};
