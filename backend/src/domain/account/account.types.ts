import type { Role } from "../shared/types.js";

export type Account = {
  id: string;
  email: string;
  role: Role;
  memberId: string | null;
};
