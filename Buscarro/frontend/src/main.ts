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

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // 👈 define o pacote padrão de ícones
  },
});

createApp(App).use(vuetify).use(router).mount("#app");
