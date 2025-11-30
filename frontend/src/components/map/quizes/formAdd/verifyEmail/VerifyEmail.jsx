import styles from "./VerifyEmail.module.css";
import iconInfo from "../../../../../assets/img/info.png";
import {
  alertSwalErrorQuiz,
  alertSwalSuccess,
  alertSwalWarning
} from "../../../../sweetAlert/sweetAlert";
import { useState } from "react";
import { useFormQuiz } from "../../../../../contexts/quizesContext/FormAddQuizContext";
import { VerificationCode } from "./verificationCode/VerificationCode";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const VerifyEmail = () => {
  const { emailEntered, msjErrorEmail, handleEmailChanged } = useFormQuiz();
  const { loading, setLoading } = useFormQuiz();
  const [codeAlreadySent, setCodeAlreadySent] = useState(false);

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
      console.log(error);
      alertSwalErrorQuiz("Ups, error al enviar codigo de verificacion", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.verifyEmail}>
      <h4>
        <img src={iconInfo}></img> La verificacion sera necesaria solo una vez
        cada 24 horas
      </h4>
      {!codeAlreadySent && (
        <div className={styles.rowOne}>
          <div className={styles.columnOne}>
            <label>Ingresar correo:</label>
            <input
              autoComplete="off"
              type="email"
              name="email"
              placeholder="Ingrese su correo para verificar"
              value={emailEntered}
              onChange={(event) => handleEmailChanged(event.target.value)}
            ></input>
            {msjErrorEmail && <p>{msjErrorEmail}</p>}
          </div>

          <button onClick={(event) => handleSendCode(event)}>
            Enviar codigo
          </button>
        </div>
      )}
      {!codeAlreadySent && loading && <p>Enviando codigo...</p>}

      {codeAlreadySent && (
        <VerificationCode
          setCodeAlreadySent={setCodeAlreadySent}
          handleSendCode={handleSendCode}
        />
      )}
    </div>
  );
};
