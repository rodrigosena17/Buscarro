import { userService } from "./userService";

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async login({ email, password }: LoginData) {
    try {
      // 1️⃣ Busca todos os usuários
      const users = await userService.getUserInfo("");

      // 2️⃣ Garante que seja uma lista
      const userList = Array.isArray(users) ? users : [users];

      // 3️⃣ Encontra o usuário
      const foundUser = userList.find(
        (user: any) => user.email === email && user.password === password
      );

      if (!foundUser) {
        throw new Error("E-mail ou senha incorretos");
      }

      // 4️⃣ Simula um token
      const fakeToken = btoa(`${email}:${password}`);

      // 5️⃣ Armazena localmente
      localStorage.setItem("loggedUser", JSON.stringify(foundUser));
      localStorage.setItem("token", fakeToken);

      return foundUser;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("token");
  },

  getLoggedUser() {
    const user = localStorage.getItem("loggedUser");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("loggedUser");
  },
};
