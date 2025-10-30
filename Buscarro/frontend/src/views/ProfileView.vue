<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center page-background"
  >
    <!-- Card Principal -->
    <v-card class="pa-10 rounded-md" width="700" elevation="16" color="#ffffff">
      <div class="d-flex align-center mb-6">
        <v-avatar color="primary" size="64" class="mr-4">
          <span class="text-h4">{{ userAvatarLetter }}</span>
        </v-avatar>
        <div>
          <h2 class="profile-title">Meu Perfil</h2>
          <h3 class="profile-subtitle">Gerencie suas informações</h3>
        </div>
      </div>

      <!-- Formulário de Edição -->
      <v-form @submit.prevent="handleSubmit(handleSave)">
        <!-- 2x2 Grid de Inputs (Username, Email, Senha 1, Senha 2) -->
        <v-row>
          <!-- Coluna 1: Username -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Username"
              v-model="data.username.value.value"
              :error-messages="data.username.errorMessage.value"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="input-custom"
              :readonly="!isEditing"
            ></v-text-field>
          </v-col>

          <!-- Coluna 2: Email -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Email"
              v-model="data.email.value.value"
              :error-messages="data.email.errorMessage.value"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              class="input-custom"
              :readonly="!isEditing"
            ></v-text-field>
          </v-col>

          <!-- Coluna 3: Password1 (Nova Senha) -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Nova Senha"
              v-model="data.password1.value.value"
              :error-messages="data.password1.errorMessage.value"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              type="password"
              class="input-custom"
              :readonly="!isEditing"
              hint="Preencha apenas para alterar a senha."
              persistent-hint
            ></v-text-field>
          </v-col>

          <!-- Coluna 4: Password2 (Confirmar Senha) -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Confirmar Senha"
              v-model="data.password2.value.value"
              :error-messages="data.password2.errorMessage.value"
              prepend-inner-icon="mdi-lock-check-outline"
              variant="outlined"
              type="password"
              class="input-custom"
              :readonly="!isEditing"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Botão Principal de Ação (Editar/Salvar) -->
        <v-btn
          class="action-btn-main mt-6"
          block
          rounded="4"
          size="large"
          :type="isEditing ? 'submit' : 'button'"
          @click="isEditing ? undefined : enableEditMode()"
          :loading="userStore.loading"
        >
          {{ isEditing ? "Salvar Alterações" : "Editar Informações" }}
        </v-btn>

        <!-- Botão Secundário (Cancelar/Excluir) -->
        <v-btn
          variant="text"
          class="secondary-btn py-4 text-h6 mt-4"
          block
          rounded="4"
          :color="isEditing ? 'blue-darken-2' : 'red-darken-2'"
          @click="isEditing ? cancelEditMode() : (isDeleteModalOpen = true)"
        >
          {{ isEditing ? "Cancelar Edição" : "Excluir Conta" }}
        </v-btn>
      </v-form>

      <!-- Mensagem de Erro da Store -->
      <v-alert
        v-if="userStore.error"
        type="error"
        density="compact"
        class="mt-4"
      >
        {{ userStore.error }}
      </v-alert>
    </v-card>

    <!-- --------------------------------- -->
    <!-- Modal de Confirmação de Exclusão -->
    <!-- --------------------------------- -->
    <v-dialog v-model="isDeleteModalOpen" max-width="400">
      <v-card class="pa-4">
        <v-card-title class="text-h5 red--text text--darken-2">
          <v-icon color="red-darken-2" class="mr-2">mdi-alert-octagon</v-icon>
          Confirmação de Exclusão
        </v-card-title>
        <v-card-text>
          Você tem certeza que deseja **excluir permanentemente sua conta**?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="isDeleteModalOpen = false"
            color="grey-darken-1"
            :disabled="userStore.loading"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="red-darken-2"
            variant="flat"
            @click="handleDeleteUser"
            :loading="userStore.loading"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useUserStore } from "../store/"; // Ajuste o caminho se necessário
import { useUserData } from "../composables/user/useUserData"; // Importa o composable
import { useRouter } from "vue-router";
import type { ICreateUser } from "../schemas/user.schema";

const router = useRouter();
const userStore = useUserStore();
const isEditing = ref(false);
const isDeleteModalOpen = ref(false); // Novo estado para o modal de exclusão

// 1. Usando o composable para gerenciar o formulário com Vee-Validate
// Assumindo que useUserData retorna { username, email, password1, password2 }
const { data, handleSubmit, resetForm } = useUserData();

// Nota: O campo 'name' foi removido para seguir o layout 2x2 estrito dos 4 campos do ICreateUser.

// 2. Preenchendo o formulário com os dados da Store
const loadUserData = () => {
  const user = userStore.user;
  if (user) {
    // Definindo os valores no Vee-Validate
    data.username.value.value = user.username;
    data.email.value.value = user.email;

    // Limpar campos de senha ao carregar/cancelar
    data.password1.value.value = "";
    data.password2.value.value = "";
  }
};

onMounted(() => {
  // Garantir que os dados do usuário estejam carregados
  if (!userStore.user) {
    userStore.fetchUserInfo();
  }
  loadUserData();
});

// Acompanha a store caso os dados cheguem depois do fetchUserInfo
watch(
  () => userStore.user,
  (newUser) => {
    if (newUser) {
      loadUserData();
    }
  },
  { immediate: true }
);

// 3. Lógica para o botão principal
const enableEditMode = () => {
  // Apenas habilita a edição
  isEditing.value = true;
};

const cancelEditMode = () => {
  // Cancela a edição e reverte os campos para o estado salvo
  isEditing.value = false;
  loadUserData(); // Recarrega os valores originais e limpa senhas
  resetForm(); // Reseta estados de validação do vee-validate
};

// 4. Função de Save (chamada pelo handleSubmit do Vee-Validate)
const handleSave = async (values: ICreateUser) => {
  const updatedData: Partial<ICreateUser> = {
    username: values.username,
    email: values.email,
  };

  // Logica Condicional para Senha:
  // Se o usuário preencheu o campo de Nova Senha, enviamos os dados de senha.
  if (values.password1) {
    updatedData.password1 = values.password1;
    updatedData.password2 = values.password2;
  }

  try {
    await userStore.updateUser(updatedData);
    isEditing.value = false; // Sai do modo de edição após o sucesso
    // Garante que os campos de senha sejam limpos localmente após a atualização
    data.password1.value.value = "";
    data.password2.value.value = "";
  } catch (error) {
    // O toast de erro já é disparado na store
    console.error("Falha ao salvar perfil:", error);
  }
};

// 5. Função de Exclusão (chamada pelo modal)
const handleDeleteUser = async () => {
  try {
    // Chama a action que exclui o usuário e faz logout
    await userStore.deleteUser();
    isDeleteModalOpen.value = false;
    // Navega para a tela de login/inicial após a exclusão e logout
    router.push("/");
  } catch (error) {
    // O toast de erro já é disparado na store
    console.error("Falha ao excluir usuário:", error);
  }
};

const userAvatarLetter = computed(() => {
  // Se user for null ou username não existir, retorna 'U'
  return userStore.user?.username
    ? userStore.user.username.charAt(0).toUpperCase()
    : "U";
});
</script>

<style scoped>
/* Fundo da página */
.page-background {
  background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 50%, #f0f4f8 100%);
}

.v-card {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Estilos dos Títulos */
.profile-title {
  color: #1976d2;
  font-weight: 600;
  font-size: 1.6rem;
  letter-spacing: 0.5px;
}
.profile-subtitle {
  color: #555;
  font-weight: 400;
  font-size: 1rem;
}

/* Reutilizando estilo dos inputs */
.input-custom :deep(.v-field__outline) {
  border-color: #1976d2;
}
.input-custom :deep(input) {
  color: #000000;
}
.input-custom :deep(label) {
  color: #555555;
}
/* Estilo para campos readonly */
.input-custom :deep(.v-field--readonly) {
  background-color: #f4f4f4;
  opacity: 0.8;
}

/* Reutilizando estilo do Botão Principal */
.action-btn-main {
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border: none;
}
.action-btn-main:hover {
  background: linear-gradient(90deg, #1565c0, #1e88e5);
  box-shadow: 0 0 18px rgba(25, 118, 210, 0.4);
  transform: scale(1.02);
}

/* Estilo para o Botão Secundário (Cancelar/Excluir) */
.secondary-btn {
  transition: all 0.3s ease;
  font-weight: 600 !important;
}

/* Estilo específico para o botão Excluir (quando não está em modo de edição) */
.secondary-btn[color="red-darken-2"] {
  color: #b71c1c !important; /* Cor inicial mais escura */
  background-color: transparent !important;
}
.secondary-btn[color="red-darken-2"]:hover {
  color: white !important;
  background-color: #d32f2f !important; /* Vermelho escuro no hover */
  box-shadow: 0 0 12px rgba(211, 47, 47, 0.3);
  border: none !important;
  transform: scale(1.02);
}
/* Estilo para o botão Cancelar (quando está em modo de edição) */
.secondary-btn[color="blue-darken-2"] {
  color: #1565c0 !important;
}
.secondary-btn[color="blue-darken-2"]:hover {
  border-color: #1976d2 !important;
  box-shadow: 0 0 12px rgba(25, 118, 210, 0.3);
  transform: scale(1.02);
}
</style>
