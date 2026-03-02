import styles from "./VerifyEmail.module.css";
import iconInfo from "../../../../assets/img/info.png";
import iconVerifyUser from "../../../../assets/img/auth.png";
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
      <div className={styles.title}>
        <img src={iconVerifyUser}></img>
        <h3>Verificacion de correo</h3>
      </div>

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
              value={emailEntered}
              onChange={(event) => handleEmailChanged(event.target.value)}
            ></input>
            {msjErrorEmail && <p>{msjErrorEmail}</p>}
          </div>

          <button
            onClick={(event) => handleSendCode(event)}
            disabled={!codeAlreadySent && loading}
          >
            {!codeAlreadySent && loading ? "Enviando codigo..." : "Enviar"}
          </button>
        </div>
      )}

      {codeAlreadySent && <VerificationCode />}
    </div>
  );
};
