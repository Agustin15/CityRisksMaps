import { alertSwalErrorAdmin } from "../../sweetAlert/sweetAlert.js";
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const fetchActivate = async (setLoading, body, token) => {
  setLoading(true);
  try {
    const response = await fetch(LOCALHOST_BACKEND + "/user/activate/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.messageError || "Error inesperado al activar el usuario"
      );
    }

    return result;
  } catch (error) {
    alertSwalErrorAdmin(
      "Ups,hubo un error al activar el usuario",
      error.message
    );
  } finally {
    setLoading(false);
  }
};

export const fetchValidateToken = async (setLoading, token, setValidToken) => {
  setLoading(true);
  try {
    const response = await fetch(
      LOCALHOST_BACKEND + "/user/validate-activate-user-token/",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status == 401) {
        location.href = LOCALHOST_FRONTEND + "/admin/no-autorizado/";
      }
      return;
    }

    if (result) setValidToken(true);
  } catch (error) {
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

export const validationForm = (values, setErrorForm) => {
  if (values.email.length === 0) {
    setErrorForm("*Debe ingresar un correo electrónico");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values.email)) {
    setErrorForm("*Ingrese un correo electrónico válido");
    return false;
  }

  if (values.password.length === 0) {
    setErrorForm("*Debe ingresar una contraseña");
    return false;
  }

  if (values.password !== values.repeatPassword) {
    setErrorForm("*Las contraseñas no coinciden");
    return false;
  }
  return true;
};
