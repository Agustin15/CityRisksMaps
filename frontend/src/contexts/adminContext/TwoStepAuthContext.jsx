import { alertSwalErrorAdmin } from "../../components/sweetAlert/sweetAlert.js";
const VITE_LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
const VITE_LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import { createContext, useContext, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const TwoStepAuthContext = createContext();

export const TwoStepAuthProvider = ({ children }) => {
  const refInput = useRef();
  const [loadingValidation, setLoadingValidation] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [errorAuth, setErrorAuth] = useState("");
  const { setUser } = useAuth();

  const handleClick = async (indexColumn, indexRow, column, token) => {
    refInput.current.focus();

    const ok = eventKeyboard(indexColumn, indexRow, column);

    if (ok) {
      if (code.length == 0) return setError("*Debe ingresar el codigo");
      const userFound = await handleSubmit(token);
      if (userFound) {
        setUser(userFound);
        location.href = VITE_LOCALHOST_FRONTEND + "/admin/departamentos";
      }
    }
  };
  const eventKeyboard = (indexColumn, indexRow, column) => {
    setError("");

    if (indexRow == 3) {
      switch (indexColumn) {
        case 0:
          if (code.length < 6) setCode(code + column);
          return;
        case 1:
          setCode(code.substring(0, code.length - 1));
          return;
        case 2:
          return true;
      }
    } else if (code.length < 6) setCode(code + column);
  };
  const handleSubmit = async (token) => {
    try {
      setLoadingForm(true);
      const response = await fetch(
        `${VITE_LOCALHOST_BACKEND}/login/twoStepAuth/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({ code: code })
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.messageError);

      return result;
    } catch (error) {
      return alertSwalErrorAdmin(
        "Autenticacion fallida",
        error.message || "Error en la solicitud"
      );
    } finally {
      setLoadingForm(false);
    }
  };

  const validateTwo2FAToken = async (token) => {
    try {
      const response = await fetch(
        `${VITE_LOCALHOST_BACKEND}/login/validateTwoStepAuthToken/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.messageError);
    } catch (error) {
      throw error;
    }
  };

  return (
    <TwoStepAuthContext.Provider
      value={{
        handleClick,
        validateTwo2FAToken,
        loadingValidation,
        setLoadingValidation,
        loadingForm,
        setErrorAuth,
        errorAuth,
        error,
        refInput,
        code
      }}
    >
      {children}
    </TwoStepAuthContext.Provider>
  );
};

export const useTwoStepAuth = () => useContext(TwoStepAuthContext);
