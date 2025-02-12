import { type BaseSchema } from "../common/dto/base.dto";

// export enum UserRole {
//   ADMIN = "ADMIN",
//   USER = "USER",
// }

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  active?: boolean;
  role: "ADMIN" | "USER";
  password: string;
  refreshToken?: string | null;
  imageUrl?: string;
}
