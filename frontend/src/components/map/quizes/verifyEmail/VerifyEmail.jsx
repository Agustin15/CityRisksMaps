import styles from "./VerifyEmail.module.css";
import iconInfo from "../../../../assets/img/info.png";
import { VerificationCode } from "./verificationCode/VerificationCode.jsx";
import { useVerify } from "../../../../contexts/VerifyContext.jsx";
import { useState } from "react";

export const VerifyEmail = () => {
  const {
    emailEntered,
    msjErrorEmail,
    handleEmailChanged,
    loading,
    handleSendCode,
    codeAlreadySent
  } = useVerify();

  const [inputHover, setInputHover] = useState(false);

  return (
    <div className={styles.verifyEmail}>
      <h4>
        <img src={iconInfo}></img> La verificacion sera necesaria solo una vez
        cada 24 horas
      </h4>
      {!codeAlreadySent && (
        <div className={styles.rowOne}>
          <div className={styles.columnOne}>
            <label className={inputHover ? styles.lblHover : ""}>
              Ingresar correo:
            </label>
            <input
              autoComplete="off"
              type="email"
              name="email"
              value={emailEntered}
              onChange={(event) => handleEmailChanged(event.target.value)}
              onMouseLeave={() => setInputHover(false)}
              onMouseEnter={() => setInputHover(true)}
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

      {codeAlreadySent && (
        <VerificationCode
          inputHover={inputHover}
          setInputHover={setInputHover}
        />
      )}
    </div>
  );
};
