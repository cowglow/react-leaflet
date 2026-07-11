import { Resend } from "resend";
import type { Mailer } from "./auth/mailer.js";
import { consoleMailer } from "./auth/mailer.js";
import { TOKEN_TTL_MS } from "./auth/magic-link.js";

const EXPIRY_MINUTES = Math.round(TOKEN_TTL_MS / 60_000);

function buildMagicLinkEmail(url: string) {
  const subject = "Your sign-in link";
  const text = [
    "Here's your sign-in link for Visual Directory:",
    "",
    url,
    "",
    `This link expires in ${EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.`,
  ].join("\n");
  const html = `
    <p>Here's your sign-in link for Visual Directory:</p>
    <p><a href="${url}">${url}</a></p>
    <p>This link expires in ${EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
  `.trim();

  return { subject, text, html };
}

// Real email delivery via Resend (resend.com). Isolated behind the same Mailer
// interface as consoleMailer so the provider can be swapped later without touching
// callers — see getMailer() below for how the two are selected.
export const resendMailer: Mailer = {
  async sendMagicLink(email, url) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      throw new Error("RESEND_API_KEY and EMAIL_FROM must be set to send email in production");
    }

    const { subject, text, html } = buildMagicLinkEmail(url);
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to: email, subject, text, html });
    if (error) {
      throw new Error(`Resend failed to send magic-link email: ${error.message}`);
    }
  },
};

export function getMailer(): Mailer {
  return process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? resendMailer : consoleMailer;
}
