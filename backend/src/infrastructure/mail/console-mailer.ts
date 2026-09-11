import type { Mailer } from "../../application/mailer.js";

// Logs the raw link instead of sending real email. Used in dev, and as the
// fallback whenever RESEND_API_KEY/EMAIL_FROM aren't set — see get-mailer.ts.
export const consoleMailer: Mailer = {
  async sendMagicLink(email, url) {
    console.log(`[mailer] magic link for ${email}: ${url}`);
  },
};
