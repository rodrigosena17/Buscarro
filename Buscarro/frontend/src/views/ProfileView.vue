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

      <v-form @submit.prevent="handleSubmit(handleSave)">
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
            />
          </v-col>

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
            />
          </v-col>
        </v-row>

        <v-btn
          class="action-btn-main mt-6"
          block
          rounded="4"
          size="large"
          :type="isEditing ? 'submit' : 'button'"
          @click="isEditing ? null : enableEditMode()"
          :loading="userStore.loading"
        >
          {{ isEditing ? "Salvar Alterações" : "Editar Informações" }}
        </v-btn>

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
import { ref, onMounted, watch, computed } from "vue";
import { useUserStore } from "../store/";
import { useUserData } from "../composables/user/useUserData";
import { useRouter } from "vue-router";
import type { ICreateUser } from "../schemas/user.schema";

const router = useRouter();
const userStore = useUserStore();
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const { data, handleSubmit, resetForm } = useUserData();

const loadUserData = () => {
  const user = userStore.user;
  if (!user) return;

  data.username.value.value = user.username;
  data.email.value.value = user.email;
  data.password1.value.value = "";
  data.password2.value.value = "";
};

onMounted(() => {
  if (!userStore.user) userStore.fetchUserInfo();
  loadUserData();
});

watch(
  () => userStore.user,
  (newUser) => newUser && loadUserData(),
  { immediate: true }
);

const enableEditMode = () => (isEditing.value = true);

const cancelEditMode = () => {
  isEditing.value = false;
  loadUserData();
  resetForm();
};

const handleSave = async (values: ICreateUser) => {
  const updatedData: any = {
    username: values.username,
    email: values.email,
    id: userStore.user?.id,
  };

  if (values.password1) {
    updatedData.password1 = values.password1;
    updatedData.password2 = values.password2;
  }

  try {
    await userStore.updateUser(updatedData);
    isEditing.value = false;
    data.password1.value.value = "";
    data.password2.value.value = "";
  } catch (e) {
    console.error(e);
  }
};

const handleDeleteUser = async () => {
  try {
    await userStore.deleteUser(userStore.user?.id);
    isDeleteModalOpen.value = false;
    router.push("/");
  } catch (e) {
    console.error(e);
  }
};

const userAvatarLetter = computed(() =>
  userStore.user?.username
    ? userStore.user.username.charAt(0).toUpperCase()
    : "U"
);
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
.action-btn-main {
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  color: white !important;
  font-weight: 600;
}
.secondary-btn {
  font-weight: 600 !important;
}
</style>
