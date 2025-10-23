import axios from "axios";
import { type ICreateUser } from "../schemas/user.schema";

const API_URL = "/api/users/";

export const userService = {
  async createUser(user: ICreateUser) {
    try {
      const response = await axios.post(`${API_URL}register/`, user);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      throw error.response?.data || error;
    }
  },

  async getUserInfo() {
    try {
      const response = await axios.get(`${API_URL}info/`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar informações do usuário:", error);
      throw error.response?.data || error;
    }
  },

  async updateUser(token: string, updatedData: Partial<ICreateUser>) {
    try {
      const response = await axios.put(`${API_URL}info/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Lógica de login simulada, já que o backend não tem rota /login
   */
  async login(email: string, password: string) {
    const users = await this.getUserInfo();
    const userList = Array.isArray(users) ? users : [users];

    const foundUser = userList.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Email ou senha incorretos");
    }

    // Gera um token falso só pra simular sessão
    const fakeToken = btoa(`${foundUser.email}:${foundUser.password}`);

    // Salva localmente
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("loggedUser", JSON.stringify(foundUser));

    return foundUser;
  },
};
