import { useForm, useField } from "vee-validate";
import {
  type IUpdateUser,
  updateUserSchema,
} from "../../schemas/userUpdate.schema";

export function useUserUpdateData() {
  const { handleSubmit, resetForm, errors, setValues } = useForm<IUpdateUser>({
    validationSchema: updateUserSchema,
    initialValues: {
      id: "",
      username: "",
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const data = {
    id: useField<string>("id", updateUserSchema),
    username: useField<string>("username", updateUserSchema),
    email: useField<string>("email", updateUserSchema),
    first_name: useField<string>("first_name", updateUserSchema),
    last_name: useField<string>("last_name", updateUserSchema),
  };

  return {
    setValues,
    data,
    handleSubmit,
    errors,
    resetForm,
  };
}
