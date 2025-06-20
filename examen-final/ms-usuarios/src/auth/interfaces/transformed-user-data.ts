import { Role } from "src/common/interfaces/role";

export interface TransformedUserData {
  userId: string;
  email: string;
  password: string;
  roles: Role[];
}