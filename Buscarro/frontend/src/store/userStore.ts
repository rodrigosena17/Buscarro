import { defineStore } from "pinia";
import { userService } from "../service/user.service";
import type { ICreateUser } from "../schemas/user.schema";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as ICreateUser | null,
    token: localStorage.getItem("token") || "",
    loading: false,
    error: "" as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async registerUser(userData: ICreateUser) {
      this.loading = true;
      this.error = null;
      try {
        const data = await userService.createUser(userData);
        this.user = data.user || userData;
        this.token = data.token || "";
        if (this.token) localStorage.setItem("token", this.token);
        return data;
      } catch (err: any) {
        this.error = err.message || "Erro ao registrar usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserInfo() {
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await userService.getUserInfo(this.token);
        this.user = data;
      } catch (err: any) {
        this.error = err.message || "Erro ao buscar informações do usuário";
        this.logout();
      } finally {
        this.loading = false;
      }
    },

    async updateUser(updatedData: Partial<ICreateUser>) {
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await userService.updateUser(this.token, updatedData);
        this.user = { ...this.user, ...data };
        return data;
      } catch (err: any) {
        this.error = err.message || "Erro ao atualizar usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser() {
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        await userService.deleteUser(this.token);
        this.logout();
      } catch (err: any) {
        this.error = err.message || "Erro ao excluir usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
    },
  },
});
