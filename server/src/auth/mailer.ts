export interface Mailer {
  sendMagicLink(email: string, url: string): Promise<void>;
}

// Dev-only stand-in — logs the raw link instead of sending real email, so the flow
// stays testable without hitting a provider. Never used in production (see
// getMailer() in ../email.ts), but the NODE_ENV check here is defense in depth in
// case something calls this directly.
export const consoleMailer: Mailer = {
  async sendMagicLink(email, url) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[mailer] magic link for ${email}: ${url}`);
    }
  },
};
