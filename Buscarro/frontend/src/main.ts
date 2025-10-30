// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Importe o CSS

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

const options = {
  position: "top-right",
  timeout: 5000, // 5 segundos
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

// 3. Registre o plugin
app.use(Toast, options); // Passe as opções aqui

app.mount("#app");
