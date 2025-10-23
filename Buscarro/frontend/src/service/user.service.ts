import axios from "axios";
import { type ICreateUser } from "../schemas/user.schema";

// URL base da API
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

  async getUserInfo(token: string) {
    try {
      const response = await axios.get(`${API_URL}info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  async deleteUser(token: string) {
    try {
      const response = await axios.delete(`${API_URL}delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro ao deletar usuário:", error);
      throw error.response?.data || error;
    }
  },
};
