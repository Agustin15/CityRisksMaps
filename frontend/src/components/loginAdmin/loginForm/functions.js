const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;
import { alertSwalErrorAdmin } from "../../sweetAlert/sweetAlert.js";

export const submitForm = async (values, errors, setErrors) => {
  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  try {
    setErrors({ email: "", password: "" });

    if (!regexEmail.test(values.email)) {
      setErrors({
        ...errors,
        ["email"]: "*Complete correctamente el campo correo"
      });
      return;
    } else if (values.password.length == 0) {
      setErrors({
        ...errors,
        ["password"]: "*Complete el campo contraseña"
      });
      return;
    }

    const result = await fetchLogin(values);
    return result;
  } catch (error) {
    throw error;
  }
};

const fetchLogin = async (values) => {
  try {
    const response = await fetch(localhostBackend + "/admin/login/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);

    return result;
  } catch (error) {
    throw error;
  }
};
