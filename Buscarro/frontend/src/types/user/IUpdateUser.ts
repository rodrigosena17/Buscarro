import type { ICreateUser } from "../../schemas";

export interface IUpdateUser extends ICreateUser {
  id: string;
}
