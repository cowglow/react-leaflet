import type { Member, MemberInput } from "../../domain/member/member.types.js";

// Each mutating method is responsible for making its write and its audit-log entry
// atomic (see infrastructure/prisma/member.repository.ts) — that's a persistence
// detail the application layer shouldn't need to know the shape of, so it isn't
// exposed here as a separate "transaction" concept. `update`/`delete` return `null`
// when `id` doesn't exist, letting ports/http's routes render the same 404 body
// they always have.
export interface MemberRepository {
  findAll(): Promise<Member[]>;
  findById(id: string): Promise<Member | null>;
  create(input: MemberInput, actorAccountId: string): Promise<Member>;
  update(id: string, input: MemberInput, actorAccountId: string): Promise<Member | null>;
  delete(id: string, actorAccountId: string): Promise<boolean>;
}
