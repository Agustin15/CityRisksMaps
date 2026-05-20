const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import {
  alertSwalErrorAdmin,
  alertSwalSuccess
} from "../../../sweetAlert/sweetAlert.js";

export const arrayRegex = [
  {
    pattern: /[a-z]/,
    valid: true,
    msj: "Minúsculas"
  },
  {
    pattern: /[A-Z]/,
    valid: true,
    msj: "Mayúsculas"
  },
  { pattern: /[0-9]/, valid: true, msj: "Dígitos" },
  {
    pattern: /[#?!@$%^&*-]/,
    valid: true,
    msj: "Carácteres especiales"
  },
  {
    pattern: /.{8,}/,
    valid: true,
    msj: "Al menos 8 caracteres"
  }
];

export const validationForm = (values) => {
  const errorsInput = {
    oldPassword:
      values.oldPassword.length == 0
        ? "Debe ingresar la antigua contraseña"
        : "",
    newPassword:
      values.oldPassword.length == 0
        ? "Debe ingresar una nueva contraseña"
        : "",
    repeatPassword:
      values.repeatPassword != values.newPassword
        ? "Las contraseñas no coinciden"
        : ""
  };

  return errorsInput;
};

export const fetchUpdatePassword = async (
  setLoading,
  setUser,
  values,
  idUser
) => {
  try {
    setLoading(true);
    const response = await fetch(
      LOCALHOST_BACKEND + "/admin/profile/resetPassword/" + idUser,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json"
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status == 401) {
        setUser();
        location.href = LOCALHOST_FRONTEND + "/admin/login";
      }
      throw new Error(result.messageError);
    }

    return true;
  } catch (error) {
    alertSwalErrorAdmin(
      "Ups, no se pudo actualizar la contraseña",
      error.message
    );
  } finally {
    setLoading(false);
  }
};
