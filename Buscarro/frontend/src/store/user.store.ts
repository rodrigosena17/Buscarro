import { defineStore } from "pinia";
import { userService } from "../service/user.service";
import type { ICreateUser } from "../schemas/user.schema";
import { useToast } from "vue-toastification";
import type { IGetUser, IUpdateUser } from "../types";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {} as IGetUser,
    currentUserId: "",
    token: localStorage.getItem("access_token") || "",
    loading: false,
    error: "" as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async registerUser(userData: ICreateUser) {
      const toast = useToast();
      this.loading = true;
      this.error = null;
      try {
        const data = await userService.create(userData);
        this.user = data.user || userData;
        this.token = data.token || "";
        if (this.token) localStorage.setItem("access_token", this.token);
        toast.success("Usuário criado");
        return data;
      } catch (error: any) {
        toast.error(`Usuário existente, tente outro Username`);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserInfo() {
      const toast = useToast();
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await userService.getCurrenteUserInfo();
        this.user = data;
      } catch (err: any) {
        toast.error("Erro ao buscar informações do usuário");
        this.logout();
      } finally {
        this.loading = false;
      }
    },

    async updateUser(updatedData: IUpdateUser) {
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await userService.update(updatedData);

        // Se o backend retorna o usuário atualizado direto:
        this.user = data;

        // Se o backend retorna um objeto { user: {...} }:
        // this.user = data.user || data;

        return data;
      } catch (err: any) {
        this.error = err.message || "Erro ao atualizar usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // trecho do store: actions
    async deleteUser(id: string) {
      const toast = useToast();
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        // chama o service sem passar token como id
        await userService.deleteById(id);
        toast.success("Usuário deletado");
        this.logout();
      } catch (err: any) {
        this.error = err.message || "Erro ao excluir usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = {} as IGetUser;
      this.token = "";
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("loggedUser");
    },

    async login(username: string, password1: string) {
      this.loading = true;
      this.error = null;

      try {
        const user = await userService.login(username, password1);

        // Pega os tokens diretamente do localStorage
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        this.token = accessToken || "";

        // Garante que os tokens fiquem sincronizados
        if (accessToken) localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

        this.fetchUserInfo();

        return user;
      } catch (err: any) {
        this.error = err.message || "Erro ao realizar login";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
