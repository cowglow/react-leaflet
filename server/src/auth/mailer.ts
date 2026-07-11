export interface Mailer {
  sendMagicLink(email: string, url: string): Promise<void>;
}

// Logs the raw link instead of sending real email. Used in dev, and as the
// production fallback until Resend is configured — see getMailer() in
// ../email.ts, which picks this whenever RESEND_API_KEY/EMAIL_FROM aren't set.
export const consoleMailer: Mailer = {
  async sendMagicLink(email, url) {
    console.log(`[mailer] magic link for ${email}: ${url}`);
  },
};
