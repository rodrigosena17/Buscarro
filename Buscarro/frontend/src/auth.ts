import { getUserInfo } from "./userService";

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginData) {
  try {
    const users = await getUserInfo();

    // Caso o endpoint retorne apenas UM usuário, adapte aqui:
    const userList = Array.isArray(users) ? users : [users];

    const foundUser = userList.find(
      (user: any) => user.email === email && user.password === password
    );

    if (!foundUser) {
      throw new Error("Email ou senha incorretos");
    }

    localStorage.setItem("loggedUser", JSON.stringify(foundUser));
    return foundUser;
  } catch (err) {
    throw err;
  }
}

export function logoutUser() {
  localStorage.removeItem("loggedUser");
}

export function getLoggedUser() {
  const user = localStorage.getItem("loggedUser");
  return user ? JSON.parse(user) : null;
}
