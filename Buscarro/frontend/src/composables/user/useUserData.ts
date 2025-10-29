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
    username: useField<string>("username"),
    email: useField<string>("email"),
    password1: useField<string>("password1"),
    password2: useField<string>("password2"),
  };

  return {
    data,
    handleSubmit,
    errors,
    resetForm,
  };
}
