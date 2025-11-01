<template>
  <v-app-bar app color="white" elevation="4" density="comfortable">
    <v-toolbar-title class="logo-container">
      <router-link to="/">
        <v-img
          :src="logoURL"
          alt="Logo"
          width="180"
          height="auto"
          contain
          class="logo-img"
        />
      </router-link>
    </v-toolbar-title>

    <v-spacer />

    <div class="d-flex justify-center w-25 mt-5">
      <v-text-field
        required
        prepe
        single-line
        autocomplete="off"
        clearable
        density="compact"
        variant="outlined"
        label="Pesquise o seu carro!"
        prepend-inner-icon="mdi-car-search"
      ></v-text-field>
    </div>

    <v-spacer />

    <div class="user-menu-container">
      <!-- Controlamos o menu via v-model para facilitar debug -->
      <v-menu v-model="menuOpen" offset-y>
        <!-- Usando a sintaxe recomendada do slot activator -->
        <template #activator="{ props }">
          <v-btn v-bind="props" class="user-btn" icon>
            <v-icon size="x-large">mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list class="mt-2" density="compact" elevation="8">
          <!-- Usamos v-list-item como botão (tag="button"), garantindo acessibilidade -->
          <v-list-item
            @click="goToProfile"
            tag="button"
            prepend-icon="mdi-account-outline"
            class="menu-item w-100 d-flex align-center ga-2"
          >
            <span>Meu perfil</span>
          </v-list-item>

          <v-divider />
          <v-list-item
            @click="goToProfile"
            tag="button"
            prepend-icon="mdi-star"
            class="w-100 d-flex align-center ga-2 menu-item-fav"
          >
            <span>Meus favoritos</span>
          </v-list-item>

          <v-divider />

          <v-list-item
            @click="onLogout"
            tag="button"
            prepend-icon="mdi-logout"
            class="w-100 d-flex align-center menu-item-logout"
          >
            <span>Sair</span>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store"; // ajuste se necessário
import logoImage from "../assets/logo.jpg";

const router = useRouter();
const userStore = useUserStore();
const logoURL = logoImage;
const accessToken = localStorage.getItem("access_token");
// controla o menu explicitamente
const menuOpen = ref(false);

const goToProfile = () => {
  // fecha o menu e navega
  menuOpen.value = false;
  console.log(accessToken);
  if (!accessToken) {
    router.push("/login");
  }
  // preferível usar name das rotas se configurado: router.push({ name: 'userProfile' })
  router.push("/perfil").catch(() => {});
};

const onLogout = () => {
  // fecha o menu antes de executar logout
  menuOpen.value = false;
  try {
    if (userStore && typeof userStore.logout === "function") {
      userStore.logout();
    } else {
      console.warn("userStore.logout não encontrado");
    }
  } catch (err) {
    console.error("Erro no logout:", err);
  }
  router.push("/login").catch(() => {});
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
  max-height: 50px;
}

/* nav btn */
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

/* user */
.user-btn {
  color: #1976d2 !important;
  margin-right: 16px;
  transition: all 0.3s ease;
}
.user-btn:hover {
  transform: scale(1.1);
  color: #1565c0 !important;
}

.menu-item:hover {
  background-color: rgba(25, 118, 210, 0.05);
  color: #1976d2 !important;
}
.menu-item-logout:hover {
  background-color: rgba(211, 47, 47, 0.1);
  color: #d32f2f !important;
}
.menu-item-fav:hover {
  background-color: rgba(25, 118, 210, 0.05);
  color: #1976d2 !important;
}
</style>
