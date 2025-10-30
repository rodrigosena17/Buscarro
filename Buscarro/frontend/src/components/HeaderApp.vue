<template>
  <v-app-bar
    app
    color="white"
    elevation="4"
    density="comfortable"
    class="app-header"
  >
    <v-toolbar-title class="logo-container">
      <router-link to="/">
        <v-img
          :src="logoURL"
          alt="Logo"
          width="180"
          height="auto"
          contain
          class="logo-img"
        ></v-img>
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <div class="d-flex justify-center">
      <v-btn
        to="/motos"
        class="nav-btn mx-2"
        prepend-icon="mdi-motorbike"
        variant="text"
        size="large"
      >
        Motos
      </v-btn>
      <v-btn
        to="/carros"
        class="nav-btn mx-2"
        prepend-icon="mdi-car"
        variant="text"
        size="large"
      >
        Carros
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <div class="user-menu-container">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="user-btn" icon variant="text">
            <v-icon size="x-large">mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list class="mt-2" density="compact" elevation="8">
          <v-list-item
            @click="goToProfile"
            prepend-icon="mdi-account-outline"
            class="menu-item"
          >
            <v-list-item-title>Meu Perfil</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            @click="logout"
            prepend-icon="mdi-logout"
            class="menu-item menu-item-logout"
          >
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../store"; // Ajuste o caminho se necessário
import logoImage from "../assets/logo.jpg"; // Reutilizando o logo

const router = useRouter();
const userStore = useUserStore();
const logoURL = logoImage;

// Navega para a página de perfil
const goToProfile = () => {
  router.push("/userProfile"); // Defina a rota do seu perfil
};

// Função de logout
const logout = () => {
  // Adicione sua lógica de store para limpar o usuário/token
  userStore.logout();
  router.push("/"); // Redireciona para o login
};
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid #e0e0e0 !important;
}

.logo-container {
  cursor: pointer;
  max-width: 200px;
  margin-left: 16px;
}

.logo-img {
  max-height: 50px; /* Ajuste a altura do logo no header */
}

/* Estilo dos botões de navegação central */
.nav-btn {
  color: #1976d2 !important;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background-color: rgba(25, 118, 210, 0.05);
  transform: scale(1.05);
}

/* Estilo do botão de usuário */
.user-btn {
  color: #1976d2 !important;
  margin-right: 16px;
  transition: all 0.3s ease;
}

.user-btn:hover {
  transform: scale(1.1);
  color: #1565c0 !important;
}

/* Estilo dos itens do menu dropdown */
.menu-item {
  color: #333;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(25, 118, 210, 0.05);
  color: #1976d2 !important;
}

.menu-item-logout:hover {
  background-color: rgba(211, 47, 47, 0.1);
  color: #d32f2f !important;
}
</style>
