import api from "../api.config";
import { type ICreateUser } from "../schemas/user.schema";
import type { IUpdateUser } from "../types";
import { useToast } from "vue-toastification";
const API_URL = "/api/users/";

export const userService = {
  async create(user: ICreateUser) {
    try {
      const response = await api.post(`${API_URL}register/`, user);
      return response.data;
    } catch (error: any) {
      if (error.request.response) {
        const toast = useToast();
        toast.error("Senha muito comum");
      }
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

  async update(updatedData: IUpdateUser) {
    try {
      const response = await api.put(`${API_URL}info/`, updatedData);
      const toast = useToast();
      toast.success("Usuário atualizado com sucesso!");
      return response.data; // <- Retorna o objeto do backend
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      throw error.response?.data || error;
    }
  },

  async deleteById(id: string) {
    try {
      const response = await api.delete(`${API_URL}delete/`, { data: { id } });
      return response.data;
    } catch (err: any) {
      console.error("Erro ao deletar o usuário por id:", err);
      throw err.response?.data || err;
    }
  },

  async login(username: string, password: string) {
    const response = await api.post(`/api/login/`, { username, password });
    const { access, refresh } = response.data;

    // Armazena tokens e usuário
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  },
};
