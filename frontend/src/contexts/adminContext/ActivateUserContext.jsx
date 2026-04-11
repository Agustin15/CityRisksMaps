import { createContext } from "react";
import iconActivate from "../../assets/img/activateUser.png";
import { alertSwalErrorAdmin } from "../../components/sweetAlert/sweetAlert.js";
import { alertSwalConfirmRedirectionToLogin } from "../../components/sweetAlert/sweetAlert.js";
import { useContext, useState } from "react";
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

const ActivateUserContext = createContext();

export const ActivateUserProvider = ({ children }) => {
  const [loadingValidation, setLoadingValidation] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [errorForm, setErrorForm] = useState();
  const [values, setValues] = useState({
    email: "",
    password: "",
    repeatPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const [regex, setRegex] = useState([
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
  ]);

  const fetchActivate = async (body, token) => {
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
      return;
    }
  };

  const fetchValidateToken = async (token) => {
    setLoadingValidation(true);
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
      setLoadingValidation(false);
    }
  };

  const validationForm = () => {
    if (values.email.length === 0) {
      setErrorForm("*Debe ingresar un correo electrónico");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      setErrorForm("*Ingrese un correo electrónico válido");
      return false;
    }

    if (values.password.length == 0 || regex.some((rule) => !rule.valid)) {
      setErrorForm("*Debe ingresar una contraseña");
      return false;
    }

    if (values.password !== values.repeatPassword) {
      setErrorForm("*Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event, token) => {
    event.preventDefault();
    setErrorForm();

    const validForm = validationForm();

    if (!validForm) return;

    const result = await fetchActivate(values, token);

    if (result) {
      setValues({
        email: "",
        password: "",
        repeatPassword: ""
      });

      setRegex((current) =>
        current.map((rule) => ({
          ...rule,
          valid: false
        }))
      );
      const result = await alertSwalConfirmRedirectionToLogin(iconActivate);

      if (result.isConfirmed)
        location.href = LOCALHOST_FRONTEND + "/admin/login";
    }

    return;
  };

  return (
    <ActivateUserContext.Provider
      value={{
        fetchValidateToken,
        handleSubmit,
        errorForm,
        setErrorForm,
        values,
        setValues,
        loading,
        validToken,
        loadingValidation,
        regex,
        setRegex
      }}
    >
      {children}
    </ActivateUserContext.Provider>
  );
};

export const useActivateUser = () => useContext(ActivateUserContext);
