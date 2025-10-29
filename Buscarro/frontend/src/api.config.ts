// src/api.config.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // sem barra final

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Corrigido: faltava espaço após "Bearer"
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Define tipo de conteúdo
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/user/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          // Atualiza o token e refaz a requisição
          localStorage.setItem("access_token", response.data.access);
          error.config.headers.Authorization = `Bearer ${response.data.access}`;
          return api(error.config);
        } catch (refreshError) {
          // Token inválido: limpa storage e redireciona para login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
