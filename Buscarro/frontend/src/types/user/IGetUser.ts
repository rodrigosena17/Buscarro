import type { ICreateUser } from "./ICreateUser";

export interface IGetUser extends ICreateUser {
  id: string;
  username: string;
  email: string;
  password1: string;
  password2: string;
}
