import styles from "../../verifyEmail/VerifyEmail.module.css";
import { useCookies } from "react-cookie";
import { useFormQuiz } from "../../../../../../contexts/quizesContext/FormAddQuizContext.jsx";
import { useRef } from "react";
import { alertSwalErrorQuiz } from "../../../../../sweetAlert/sweetAlert.js";

const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const VerificationCode = ({ setCodeAlreadySent, handleSendCode }) => {
  const { loading, setLoading, emailEntered } = useFormQuiz();
  const [cookies, setCookie] = useCookies();
  const refInputCode = useRef();

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    let resultVerify;

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

      resultVerify = result;
    } catch (error) {
      console.log(error);
      return alertSwalErrorQuiz("Ups, error en la verificacion", error);
    } finally {
      setLoading(false);
      if (resultVerify)
        setCookie("email", emailEntered, {
          secure: true,
          sameSite: true,
          maxAge: 24 * 3600
        });
    }
  };

  return (
    <div className={styles.enterCode}>
      <div className={styles.columnOne}>
        <label>Ingresar codigo de verificacion:</label>
        <input ref={refInputCode} type="text"></input>

        <button
          className={styles.btnSendAgain}
          onClick={(event) => handleSendCode(event)}
        >
          Volver a enviar codigo
        </button>
      </div>

      <div className={styles.row}>
        <button onClick={(event) => handleVerifyCode(event)}>Verificar</button>
        <button onClick={() => setCodeAlreadySent(false)}>Atras</button>
      </div>
      {loading && <p>Verificando...</p>}
    </div>
  );
};
