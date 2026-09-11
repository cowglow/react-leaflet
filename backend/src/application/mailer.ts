export interface Mailer {
  sendMagicLink(email: string, url: string): Promise<void>;
}
