import { createContext, useContext, useState } from "react";
import {
  alertSwalSuccess,
  alertSwalWarning,
  alertSwalErrorQuiz
} from "../components/sweetAlert/sweetAlert.js";
import { useCookies } from "react-cookie";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

const VerifyContext = createContext();

export const VerifyProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies();
  const [emailEntered, setEmailEntered] = useState();
  const [msjErrorEmail, setMsjErrorEmail] = useState();
  const [codeAlreadySent, setCodeAlreadySent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChanged = (email) => {
    let regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
      setMsjErrorEmail("Ingrese un correo valido");
    } else {
      setMsjErrorEmail();
    }

    setEmailEntered(email);
  };

  const handleSendCode = async (event) => {
    event.preventDefault();

    try {
      if (msjErrorEmail) return alertSwalWarning(msjErrorEmail);

      setLoading(true);
      const response = await fetch(localhostBackend + "/participant/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          option: "verifyParticipant",
          email: emailEntered
        })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);

      alertSwalSuccess("¡Codigo de verificacion enviado!");

      setCodeAlreadySent(true);
    } catch (error) {
      alertSwalErrorQuiz(
        "Ups, error al enviar codigo de verificacion",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event, refInputCode) => {
    event.preventDefault();

    let valueCode = refInputCode.current.value;

    try {
      if (!valueCode || valueCode.length == 0)
        throw new Error("Debe ingresar un codigo");

      setLoading(true);
      const response = await fetch(localhostBackend + "/verificationCode/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: emailEntered,
          codeEntered: valueCode
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.messageError);

      setCookie("email", emailEntered, {
        secure: true,
        sameSite: true,
        maxAge: 24 * 3600
      });
    } catch (error) {
      return alertSwalErrorQuiz("Ups, error en la verificacion", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VerifyContext.Provider
      value={{
        setEmailEntered,
        emailEntered,
        handleEmailChanged,
        msjErrorEmail,
        setMsjErrorEmail,
        codeAlreadySent,
        setCodeAlreadySent,
        handleSendCode,
        handleVerifyCode,
        loading
      }}
    >
      {children}
    </VerifyContext.Provider>
  );
};

export const useVerify = () => useContext(VerifyContext);
