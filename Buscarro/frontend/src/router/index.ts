// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
const routes = [
  {
    path: "/",
    name: "Login", // Use PascalCase para nomes de rotas para consistência
    component: LoginView,
    meta: {
      // Usamos 'hideHeader: true' para indicar que o HeaderApp deve ser ocultado
      hideHeader: true,
    },
  },
  {
    path: "/register",
    name: "Register", // Use PascalCase
    component: RegisterView,
    meta: {
      // Ocultar o HeaderApp também na página de Registro
      hideHeader: true,
    },
  },
  // ** IMPORTANTE: Adicione suas rotas autenticadas aqui (Home, Perfil, Motos, Carros) **
  {
    path: "/home",
    name: "Home",
    component: HomeView, // Exemplo de rota autenticada
    // Não precisa de 'meta: { hideHeader: false }', pois o padrão é false
  },
  {
    path: "/perfil",
    name: "Profile",
    component: ProfileView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
