import { Role } from "src/common/interfaces/role";

export interface TokenPayload {
  sub: string;
  email: string;
  roles: Role[];
}