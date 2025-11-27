import { useFormQuiz } from "../../../../../../contexts/FormAddQuizContext";
import styles from "../../verifyEmail/VerifyEmail.module.css";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const VerificationCode = ({ setCodeAlreadySent, handleSendCode }) => {
  const { loading, setLoading, emailEntered } = useFormQuiz();

  const handleVerifyCode = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(localhostBackend + "/verificationCode/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "includes",
        body: JSON.stringify({
          email: emailEntered
        })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);

      setCodeAlreadySent(true);
    } catch (error) {
      console.log(error);
      alertSwalErrorQuiz("Ups, error en la verificacion", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.enterCode}>
      <div className={styles.columnOne}>
        <label>Ingresar codigo de verificacion:</label>
        <input type="text"></input>

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
