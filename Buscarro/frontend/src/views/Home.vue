<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center home-background"
  >
    <v-card
      class="pa-10 rounded-xl shadow-xl text-center"
      width="600"
      elevation="16"
      color="#1E1E1E"
    >
      <v-img
        src="@/assets/logo.jpg"
        alt="Logo"
        max-width="150"
        class="mx-auto mb-6"
        contain
      ></v-img>

      <h1 class="text-h4 font-weight-bold mb-4" style="color: #ffffff">
        Bem-vindo, {{ user?.name || "Usuário" }}!
      </h1>

      <p class="text-body-1 mb-8" style="color: #bdbdbd">
        Você está autenticado no sistema. Aqui será sua tela inicial.
      </p>

      <v-btn
        color="#00ACC1"
        class="px-8 py-4 rounded-lg text-body-1 font-weight-bold"
        @click="handleLogout"
      >
        Sair
      </v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../service/auth.service";

export default defineComponent({
  name: "HomeView",
  setup() {
    const router = useRouter();
    const user = ref(authService.getLoggedUser());

    onMounted(() => {
      if (!authService.isAuthenticated()) {
        router.push("/login");
      }
    });

    const handleLogout = () => {
      authService.logout();
      router.push("/login");
    };

    return { user, handleLogout };
  },
});
</script>

<style scoped>
.home-background {
  background-color: #121212;
  color: #ffffff;
}
</style>
