// src/services/userService.ts
import api from "../api.config";
import { type ICreateUser } from "../schemas/user.schema";

const API_URL = "/api/users/";

export const userService = {
  async create(user: ICreateUser) {
    try {
      const response = await api.post(`${API_URL}register/`, user);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      throw error.response?.data || error;
    }
  },

  async getCurrenteUserInfo() {
    try {
      const response = await api.get(`${API_URL}info/`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar informações do usuário:", error);
      throw error.response?.data || error;
    }
  },

  async update(updatedData: Partial<ICreateUser>) {
    try {
      const response = await api.put(`${API_URL}info/`, updatedData);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      throw error.response?.data || error;
    }
  },

  async delete(id: string) {
    try {
      const response = await api.delete(`${API_URL}delete/${id}`);
      return response;
    } catch (err) {
      console.log("erro ao deleter o usuário");
    }
  },

  async login(username: string, password1: string) {
    try {
      const response = await api.post(`api/login/`, { username, password1 });
      const { access, refresh, user } = response.data;

      // Armazena tokens e usuário
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("loggedUser", JSON.stringify(user));

      return user;
    } catch (error: any) {
      console.error("Erro ao realizar login:", error);
      throw error.response?.data || error;
    }
  },
};
