const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;
import iconShowPassword from "../../../assets/img/showPassword.png";
import iconHidePassword from "../../../assets/img/hidePassword.png";
import { alertSwalErrorAdmin } from "../../sweetAlert/sweetAlert.js";

export const handleViewPassword = (event, inputPasswordRef) => {
  if (inputPasswordRef.current.type == "text") {
    event.target.src = iconHidePassword;
    inputPasswordRef.current.type = "password";
  } else {
    event.target.src = iconShowPassword;
    inputPasswordRef.current.type = "text";
  }
};

export const submitForm = async (values, errors, setErrors) => {
  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

  return await fetchLogin(values);
};

const fetchLogin = async (values) => {
  try {
    const response = await fetch(localhostBackend + "/login/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);

    return result;
  } catch (error) {
    alertSwalErrorAdmin("Ups,hubo un error al iniciar sesion", error.message);
  }
};
