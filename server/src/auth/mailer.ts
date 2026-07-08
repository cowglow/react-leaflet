export interface Mailer {
  sendMagicLink(email: string, url: string): Promise<void>;
}

// Dev-only stand-in: no email provider account exists yet, so real sending can't be
// verified end-to-end regardless. Logging the link keeps the flow fully testable
// locally; swap this for a real Mailer implementation once a provider is chosen.
export const consoleMailer: Mailer = {
  async sendMagicLink(email, url) {
    console.log(`[mailer] magic link for ${email}: ${url}`);
  },
};
