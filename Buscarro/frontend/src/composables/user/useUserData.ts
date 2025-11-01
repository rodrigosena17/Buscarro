import { useForm, useField } from "vee-validate";
import { type ICreateUser, createUserSchema } from "../../schemas/user.schema";

export function useUserData() {
  const { handleSubmit, resetForm, errors, setValues } = useForm<ICreateUser>({
    validationSchema: createUserSchema,
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password1: "",
      password2: "",
    },
  });

  const data = {
    username: useField<string>("username", createUserSchema),
    email: useField<string>("email", createUserSchema),
    first_name: useField<string>("first_name", createUserSchema),
    last_name: useField<string>("last_name", createUserSchema),
    password1: useField<string>("password1", createUserSchema),
    password2: useField<string>("password2", createUserSchema),
  };

  return {
    setValues,
    data,
    handleSubmit,
    errors,
    resetForm,
  };
}
