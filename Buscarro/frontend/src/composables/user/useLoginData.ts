import { useForm, useField } from "vee-validate";
import { loginSchema } from "../../schemas/login.schema";

export function useLoginData() {
  const { handleSubmit, resetForm, errors } = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  const data = {
    username: useField<string>("username", loginSchema),
    password: useField<string>("password", loginSchema),
  };

  return {
    data,
    handleSubmit,
    errors,
    resetForm,
  };
}
