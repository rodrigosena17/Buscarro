// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import Home from "../views/Home.vue";

const routes = [
  { path: "/", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  { path: "/home", name: "home", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
