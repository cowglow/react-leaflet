import type { Account } from "../../domain/account/account.types.js";
import type { Role } from "../../domain/shared/types.js";

export interface AccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  findByMemberId(memberId: string): Promise<Account | null>;
  create(input: { email: string; role: Role; memberId: string | null }): Promise<Account>;
  update(
    id: string,
    input: { role: Role; memberId: string | null },
    actorAccountId: string,
  ): Promise<Account | null>;
}
