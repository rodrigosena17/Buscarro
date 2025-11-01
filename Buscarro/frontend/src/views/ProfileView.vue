<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center page-background"
  >
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

      <v-form>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Username"
              v-model="data.username.value.value"
              :error-messages="data.username.errorMessage.value"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="input-custom"
              :readonly="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Email"
              v-model="data.email.value.value"
              :error-messages="data.email.errorMessage.value"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              class="input-custom"
              :readonly="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Primeiro nome"
              v-model="data.first_name.value.value"
              :error-messages="data.first_name.errorMessage.value"
              variant="outlined"
              class="input-custom"
              :readonly="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Segundo nome"
              v-model="data.last_name.value.value"
              :error-messages="data.last_name.errorMessage.value"
              variant="outlined"
              class="input-custom"
              :readonly="!isEditing"
            />
          </v-col>
        </v-row>

        <!-- Novos botões de ação --><v-row class="mt-6">
          <!-- Botão Editar (sempre visível quando não estiver editando) --><v-col
            cols="12"
            v-if="!isEditing"
          >
            <v-btn
              class="action-btn-main"
              block
              rounded="4"
              size="large"
              @click="enableEditMode()"
              :loading="userStore.loading"
            >
              <v-icon left>mdi-pencil</v-icon>
              Editar Informações
            </v-btn>
          </v-col>

          <!-- Botões Salvar e Cancelar (visíveis apenas no modo de edição) --><v-col
            cols="12"
            class="d-flex justify-space-between"
            v-if="isEditing"
          >
            <v-btn
              class="action-btn-save mr-2"
              rounded="4"
              size="large"
              type="button"
              @click="handleSave"
              :loading="userStore.loading"
            >
              <v-icon left>mdi-content-save-outline</v-icon>
              Salvar Alterações
            </v-btn>
            <v-btn
              class="action-btn-cancel ml-2"
              rounded="4"
              size="large"
              variant="outlined"
              @click="cancelEditMode()"
              :disabled="userStore.loading"
            >
              Cancelar
            </v-btn>
          </v-col>

          <!-- Botão Excluir Conta (visível apenas quando não estiver editando) --><v-col
            cols="12"
            v-if="!isEditing"
            class="mt-4"
          >
            <v-btn
              class="action-btn-delete"
              block
              rounded="4"
              size="large"
              variant="outlined"
              color="red-darken-2"
              @click="isDeleteModalOpen = true"
              :loading="userStore.loading"
            >
              <v-icon left>mdi-delete-outline</v-icon>
              Excluir Conta
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-alert
        v-if="userStore.error"
        type="error"
        density="compact"
        class="mt-4"
      >
        {{ userStore.error }}
      </v-alert>
    </v-card>

    <v-dialog v-model="isDeleteModalOpen" max-width="400">
      <v-card class="pa-4">
        <v-card-title class="text-h5 red--text text--darken-2">
          <v-icon color="red-darken-2" class="mr-2">mdi-alert-octagon</v-icon>
          Confirmação de Exclusão
        </v-card-title>
        <v-card-text
          >Você tem certeza que deseja excluir permanentemente sua
          conta?</v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="isDeleteModalOpen = false"
            color="grey-darken-1"
            :disabled="userStore.loading"
            >Cancelar</v-btn
          >
          <v-btn
            color="red-darken-2"
            variant="flat"
            @click="handleDeleteUser"
            :loading="userStore.loading"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../store/";
import { useUserUpdateData } from "../composables/user/";
import { useRouter } from "vue-router";
import type { IUpdateUser } from "../schemas";

const router = useRouter();
const userStore = useUserStore();
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);

const { data, handleSubmit, setValues, errors } = useUserUpdateData();

const loadUserData = async () => {
  await userStore.fetchUserInfo();
  const user = userStore.user;
  if (user && user.username) {
    // Note: setValues é necessário para carregar os dados no formulário
    setValues(user as unknown as IUpdateUser);
  } else {
    console.error("Erro: Usuário não encontrado no Store após fetch.");
  }
};
onMounted(async () => {
  await loadUserData();
});

const enableEditMode = () => (isEditing.value = true);

const cancelEditMode = () => {
  isEditing.value = false;
  loadUserData(); // Recarrega os dados originais e reseta o formulário
};

const handleSave = handleSubmit(async (values: IUpdateUser) => {
  try {
    await userStore.updateUser(values);
    isEditing.value = false;
    await loadUserData(); // Recarrega dados do backend
  } catch (e) {
    console.error("Erro ao salvar:", e);
  }
});

const handleDeleteUser = async () => {
  try {
    const userId = userStore.user?.id;
    if (userId) {
      await userStore.deleteUser(userId);
      isDeleteModalOpen.value = false;
      router.push("/login");
    }
  } catch (e) {
    console.error(e);
  }
};

const userAvatarLetter = computed(() => userStore.user?.first_name?.charAt(0));
</script>

<style scoped>
.page-background {
  background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 50%, #f0f4f8 100%);
}
.v-card {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}
.profile-title {
  color: #1976d2;
  font-weight: 600;
  font-size: 1.6rem;
}
.profile-subtitle {
  color: #555;
  font-size: 1rem;
}
.input-custom :deep(.v-field__outline) {
  border-color: #1976d2;
}
.input-custom :deep(input) {
  color: #000;
}
.input-custom :deep(label) {
  color: #555;
}
.input-custom :deep(.v-field--readonly) {
  background-color: #f4f4f4;
  opacity: 0.8;
}

/* Estilos para os novos botões */
.action-btn-main {
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  color: white !important;
  font-weight: 600;
}

.action-btn-save {
  background: linear-gradient(90deg, #28a745, #4caf50); /* Verde para salvar */
  color: white !important;
  font-weight: 600;
  flex-grow: 1; /* Faz o botão crescer para ocupar espaço disponível */
}

.action-btn-cancel {
  color: #6c757d !important; /* Cinza para cancelar */
  border-color: #6c757d !important;
  font-weight: 600;
  flex-grow: 1; /* Faz o botão crescer para ocupar espaço disponível */
}

.action-btn-delete {
  font-weight: 600 !important;
  color: #dc3545 !important; /* Vermelho para excluir */
  border-color: #dc3545 !important;
}

/* Mantenha o estilo para icones dentro de botões */
.v-btn .v-icon {
  margin-right: 8px; /* Espaçamento entre ícone e texto */
}
</style>
