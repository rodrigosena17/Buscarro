import { useForm, useField } from "vee-validate";

export function useLoginData() {
  const { handleSubmit, resetForm, errors } = useForm({
    initialValues: {
      username: "",
      password1: "",
    },
  });

  const data = {
    username: useField<string>("username"),
    password1: useField<string>("password1"),
  };

  return {
    data,
    handleSubmit,
    errors,
    resetForm,
  };
}