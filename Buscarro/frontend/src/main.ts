// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./router";

// 👇 importação dos ícones
import "@mdi/font/css/materialdesignicons.css";

// ✅ Importa e cria o Pinia
import { createPinia } from "pinia";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
});

// ✅ Cria a instância do app
const app = createApp(App);

// ✅ Cria o Pinia
const pinia = createPinia();

// ✅ Registra Pinia e outros plugins
app.use(pinia);
app.use(vuetify);
app.use(router);

// ✅ Monta a aplicação
app.mount("#app");
