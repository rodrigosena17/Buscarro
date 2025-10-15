<!-- src/views/RegisterView.vue -->
<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center register-background"
  >
    <v-card
      class="pa-10 rounded-xl shadow-xl"
      width="500"
      elevation="16"
      color="#1E1E1E"
    >
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold" style="color: #e53935">
          Criar Conta
        </h1>
      </div>

      <v-text-field
        label="Nome completo"
        v-model="name"
        variant="outlined"
        color="red-darken-2"
        prepend-inner-icon="mdi-account"
        class="input-custom"
      ></v-text-field>

      <v-text-field
        label="Email"
        v-model="email"
        variant="outlined"
        color="red-darken-2"
        prepend-inner-icon="mdi-email-outline"
        class="input-custom"
      ></v-text-field>

      <v-text-field
        label="Senha"
        type="password"
        v-model="password"
        variant="outlined"
        prepend-inner-icon="mdi-lock"
        class="input-custom"
      ></v-text-field>

      <!-- Botão Cadastrar -->
      <v-btn
        class="register-btn-main mt-6"
        block
        rounded
        size="large"
        @click="register"
      >
        Cadastrar
      </v-btn>

      <v-divider class="my-6"></v-divider>

      <!-- Botão Voltar -->
      <v-btn
        variant="outlined"
        class="back-btn py-4 text-h6"
        block
        rounded
        @click="$router.push('/')"
      >
        Voltar ao Login
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");

function register() {
  if (name.value && email.value && password.value) {
    alert("Usuário cadastrado com sucesso!");
    router.push("/");
  } else {
    alert("Preencha todos os campos!");
  }
}
</script>

<style scoped>
.register-background {
  background: linear-gradient(135deg, #121212 0%, #1f1f1f 50%, #2c2c2c 100%);
  background-repeat: no-repeat;
  background-size: cover;
}

.v-card {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* ---------- Inputs ---------- */
.input-custom :deep(.v-field__outline) {
  border-color: #444;
}

.input-custom :deep(.v-field__outline:hover) {
  border-color: #e53935 !important;
}

.input-custom :deep(input) {
  color: #e0e0e0;
}

.input-custom :deep(label) {
  color: #9e9e9e;
}

.input-custom :deep(.v-field__outline--focused) {
  border-color: #e53935 !important;
}

/* ---------- Botão principal (Cadastrar) ---------- */
.register-btn-main {
  background: linear-gradient(90deg, #d32f2f, #ff5252);
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border: none;
}

.register-btn-main:hover {
  background: linear-gradient(90deg, #ff1744, #d50000);
  box-shadow: 0 0 18px rgba(255, 23, 68, 0.4);
  transform: scale(1.02);
}

/* ---------- Botão secundário (Voltar) ---------- */
.back-btn {
  color: #bdbdbd !important;
  border: 1px solid #616161 !important;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: #ffffff !important;
  border-color: #e53935 !important;
  box-shadow: 0 0 12px rgba(229, 57, 53, 0.3);
  transform: scale(1.02);
}
</style>
