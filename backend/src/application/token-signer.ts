import type { Role } from "../domain/shared/types.js";

export type SessionPayload = {
  accountId: string;
  email: string;
  role: Role;
  memberId: string | null;
};

export interface TokenSigner {
  sign(payload: SessionPayload): string;
  verify(token: string): SessionPayload;
}
