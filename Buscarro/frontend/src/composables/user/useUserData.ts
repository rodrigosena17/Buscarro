import { useForm, useField } from "vee-validate";
import { type ICreateUser, createUserSchema } from "../../schemas/user.schema";

export function useUserData() {
  const { handleSubmit, resetForm, errors } = useForm<ICreateUser>({
    validationSchema: createUserSchema,
    initialValues: {
      username: "",
      email: "",
      password1: "",
      password2: "",
    },
  });

  const data = {
    username: useField<string>("username", createUserSchema),
    email: useField<string>("email", createUserSchema),
    password1: useField<string>("password1", createUserSchema),
    password2: useField<string>("password2", createUserSchema),
  };

  return {
    data,
    handleSubmit,
    errors,
    resetForm,
  };
}
