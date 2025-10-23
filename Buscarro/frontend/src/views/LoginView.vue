<!-- src/views/LoginView.vue -->
<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center login-background"
  >
    <v-card
      class="pa-10 rounded-md shadow-md"
      width="600"
      elevation="16"
      color="#ffffff"
    >
      <!-- Logo centralizada -->
      <div class="text-center mb-6">
        <v-img
          :src="imageURL"
          alt="Logo"
          width="220"
          height="auto"
          class="mx-auto mb-2 logo-img"
          contain
        ></v-img>
        <h2 class="login-title mt-2">Login</h2>
      </div>

      <!-- Formulário com v-form -->
      <v-form ref="form">
        <v-text-field
          label="Email"
          v-model="data.email.value.value"
          :error="!!errors.email"
          :error-messages="errors.email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          class="input-custom"
        ></v-text-field>

        <v-text-field
          label="Senha"
          type="password"
          v-model="data.password1.value.value"
          :error="!!errors.password1"
          :error-messages="errors.password1"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          class="input-custom"
        ></v-text-field>

        <!-- Botão Entrar -->
        <v-btn
          class="login-btn mt-6"
          block
          rounded="4"
          size="large"
          :loading="userStore.loading"
          @click="onSubmit()"
        >
          Entrar
        </v-btn>
      </v-form>

      <v-divider class="my-6"></v-divider>

      <!-- Botão Criar conta -->
      <v-btn
        variant="outlined"
        class="register-btn py-4 text-h6"
        block
        rounded="4"
        @click="$router.push('/register')"
      >
        Criar conta
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import logoImage from "../assets/logo.jpg";

// Composable e Store
import { useUserData } from "../composables";
import { useUserStore } from "../store";

const router = useRouter();
const imageURL = logoImage;

// Store
const userStore = useUserStore();

// Composable
const { data, handleSubmit, errors, resetForm } = useUserData();

// Ref do v-form
const form = ref();

// Função de envio igual ao onSubmit do registro
const onSubmit = handleSubmit(async (values: any) => {
  try {
    userStore.user = {
      username: values.email.split("@")[0],
      email: values.email,
      password1: values.password,
      password2: values.password,
    };
    alert("Login simulado com sucesso!");
    router.push("/dashboard");
  } catch (err: any) {
    alert(err.message || "Erro ao fazer login");
  }
});

onMounted(() => {
  resetForm();
});
</script>

<style scoped>
/* Tema claro */
.login-background {
  background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 50%, #f0f4f8 100%);
  background-repeat: no-repeat;
  background-size: cover;
}

.v-card {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.logo-img {
  max-height: 120px;
  object-fit: contain;
}

.login-title {
  font-family: "Montserrat", sans-serif;
  color: #1976d2;
  font-weight: 600;
  font-size: 1.6rem;
  letter-spacing: 0.5px;
}

.input-custom :deep(.v-field__outline) {
  border-color: #1976d2;
}

.input-custom :deep(.v-field__outline:hover) {
  border-color: #1565c0 !important;
}

.input-custom :deep(input) {
  color: #000000;
}

.input-custom :deep(label) {
  color: #555555;
}

.input-custom :deep(.v-field__outline--focused) {
  border-color: #1976d2 !important;
}

.login-btn {
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-radius: 6px;
  border: none;
}

.login-btn:hover {
  background: linear-gradient(90deg, #1565c0, #1e88e5);
  box-shadow: 0 0 18px rgba(25, 118, 210, 0.4);
  transform: scale(1.02);
}

.register-btn {
  color: #1565c0 !important;
  border: 1px solid #1976d2 !important;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.register-btn:hover {
  border-color: #1976d2 !important;
  box-shadow: 0 0 12px rgba(25, 118, 210, 0.3);
  transform: scale(1.02);
}
</style>
