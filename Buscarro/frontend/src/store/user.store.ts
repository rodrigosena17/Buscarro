import { defineStore } from "pinia";
import { userService } from "../service/user.service";
import type { ICreateUser } from "../schemas/user.schema";
import { useToast } from "vue-toastification";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as ICreateUser | null,
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
        if (this.token) localStorage.setItem("token", this.token);
        toast.success("Usuário criado");
        return data;
      } catch (err: any) {
        toast.error("Erro ao tentar registrar");
        throw err;
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

    async updateUser(updatedData: Partial<ICreateUser>) {
      const toast = useToast();
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await userService.update(updatedData);
        this.user = { ...this.user, ...data };
        toast.success("Usuário atualizado");
        return data;
      } catch (err: any) {
        this.error = err.message || "Erro ao atualizar usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser() {
      const toast = useToast();
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        await userService.delete(this.token);
        toast.success("Usuário deletado");
        this.logout();
      } catch (err: any) {
        this.error = err.message || "Erro ao excluir usuário";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(username: string, password1: string) {
      const toast = useToast();
      this.loading = true;
      this.error = null;

      try {
        const user = await userService.login(username, password1);

        // Pega os tokens diretamente do localStorage
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        // Atualiza o estado da store
        this.user = user;
        this.token = accessToken || "";

        // Garante que os tokens fiquem sincronizados
        if (accessToken) localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        toast.success("Login efetuado com sucesso");
        return user;
      } catch (err: any) {
        this.error = err.message || "Erro ao realizar login";
        throw err;
      } finally {
        this.loading = false;
      }

      console.log(username, password1);
    },
    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
    },
  },
});
