import styles from "./VerificationCode.module.css";
import { useRef } from "react";
import { useVerify } from "../../../../../contexts/VerifyContext.jsx";

export const VerificationCode = () => {
  const { loading, handleVerifyCode, handleSendCode, setCodeAlreadySent } =
    useVerify();
  const refInputCode = useRef();

  return (
    <div className={styles.enterCode}>
      <div className={styles.column}>
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
        <button onClick={(event) => handleVerifyCode(event, refInputCode)}>
          Verificar
        </button>
        <button onClick={() => setCodeAlreadySent(false)}>Atras</button>
      </div>
      {loading && <p>Verificando...</p>}
    </div>
  );
};
