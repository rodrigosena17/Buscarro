import * as yup from "yup";

export const loginSchema = yup
  .object({
    username: yup
      .string()
      .required("Nome de usuário é obrigatório")
      .min(3, "O nome de usuário deve ter ao menos 3 caracteres")
      .max(30, "O nome de usuário pode ter no máximo 30 caracteres")
      .matches(
        /^[a-zA-Z0-9._-]+$/,
        "Use apenas letras, números, ponto, underline ou hífen"
      ),

    password: yup
      .string()
      .required("Senha é obrigatória")
      .min(8, "A senha deve ter ao menos 8 caracteres"),
  })
  .required();

export type ICreateUser = yup.InferType<typeof loginSchema>;
