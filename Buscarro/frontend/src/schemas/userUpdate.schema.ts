import * as yup from "yup";

export const updateUserSchema = yup
  .object({
    id: yup.string().required("Id é obrigatório"),
    username: yup
      .string()
      .required("Nome de usuário é obrigatório")
      .min(3, "O nome de usuário deve ter ao menos 3 caracteres"),
    first_name: yup.string().required("O primeiro nome é obrigatório"),

    last_name: yup.string().required("O segundo nome é obrigatório"),

    email: yup
      .string()
      .required("E-mail é obrigatório")
      .email("Informe um endereço de e-mail válido"),
  })
  .required();

export type IUpdateUser = yup.InferType<typeof updateUserSchema>;
