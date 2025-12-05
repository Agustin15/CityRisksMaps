import styles from "./VerifyEmail.module.css";
import iconInfo from "../../../../assets/img/info.png";
import { VerificationCode } from "./verificationCode/VerificationCode.jsx";
import { useVerify } from "../../../../contexts/VerifyContext.jsx";

export const VerifyEmail = () => {
  const {
    emailEntered,
    msjErrorEmail,
    handleEmailChanged,
    loading,
    handleSendCode,
    codeAlreadySent
  } = useVerify();

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

      {codeAlreadySent && <VerificationCode />}
    </div>
  );
};
