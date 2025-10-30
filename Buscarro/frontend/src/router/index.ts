// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
    meta: {
      hideHeader: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: {
      hideHeader: true,
    },
  },
  {
    path: "/home",
    name: "HomeView",
    component: HomeView,
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
