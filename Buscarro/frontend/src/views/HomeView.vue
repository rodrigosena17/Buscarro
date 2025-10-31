<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center home-background"
  >
    <v-card
      class="pa-10 rounded-xl shadow-xl text-center home-card"
      width="600"
      elevation="16"
    >
      <v-img
        src="@/assets/logo.jpg"
        alt="Logo"
        max-width="150"
        class="mx-auto mb-6"
        contain
      />

      <h1 class="text-h5 font-weight-bold mb-2 title-text">
        Olá, {{ user?.username || "Usuário" }} 👋
      </h1>

      <p class="text-body-1 mb-6 subtitle-text">
        Bem-vindo(a)! Você está logado no sistema.
      </p>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const router = useRouter();
    const user = ref<any>(null);

    onMounted(() => {
      const storedUser = localStorage.getItem("loggedUser");
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      } else {
        router.push("/");
      }
    });

    return { user };
  },
});
</script>

<style scoped>
.home-background {
  background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 50%, #f0f4f8 100%);
}

.home-card {
  background-color: #ffffff !important;
  border-radius: 14px;
}

.title-text {
  color: #1976d2;
}

.subtitle-text {
  color: #555;
}
</style>
