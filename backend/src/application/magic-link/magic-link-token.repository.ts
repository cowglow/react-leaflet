import type { Account } from "../../domain/account/account.types.js";
import type { MagicLinkTokenRecord } from "../../domain/auth/magic-link.js";

export interface MagicLinkTokenRepository {
  create(accountId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  // Returns the token record plus the account it belongs to, or null if no token
  // with that hash exists at all.
  findByHash(tokenHash: string): Promise<{ record: MagicLinkTokenRecord; account: Account } | null>;
  markUsed(id: string): Promise<void>;
}
