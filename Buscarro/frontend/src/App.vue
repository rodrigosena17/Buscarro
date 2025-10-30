<template>
  <v-app>
    <HeaderApp v-if="showHeader" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import HeaderApp from "./components/HeaderApp.vue";

const route = useRoute();

const showHeader = computed(() => {
  const authRoutes = ["Login", "Register"];
  return route.name && !authRoutes.includes(String(route.name));
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
