import styles from "./Password.module.css";
import iconShowPassword from "../../../../assets/img/showPassword.png";
import iconHidePassword from "../../../../assets/img/hidePassword.png";
import iconMatch from "../../../../assets/img/match.png";
import iconNotMatch from "../../../../assets/img/notMatch.png";
import { useState } from "react";
import { RepeatPassword } from "./repeatPassword/RepeatPassword";
import { useActivateUser } from "../../../../contexts/adminContext/ActivateUserContext";

export const Passwords = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { values, setValues, regex, setRegex, errorForm } = useActivateUser();

  const handleChangePassword = (event) => {
    const password = event.target.value;
    setValues({ ...values, password });

    const newStateRegex = regex.map((rule) => ({
      ...rule,
      valid: rule.pattern.test(password)
    }));

    setRegex(newStateRegex);
  };

  return (
    <>
      <div className={styles.columnInputPassword}>
        <label>Contraseña:</label>
        <input
          autoComplete="off"
          name="password"
          onChange={(event) => handleChangePassword(event)}
          placeholder="Ingrese contraseña"
          type={showPassword ? "text" : "password"}
          value={values.password}
        />
        <button
          type="button"
          className={styles.btnPassword}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <img src={iconShowPassword} />
          ) : (
            <img src={iconHidePassword} />
          )}
        </button>
        {values.password.length == 0 &&
          errorForm &&
          errorForm.includes("contraseña") && <p>{errorForm}</p>}
          
        <div className={styles.containerRegex}>
          {values.password.length > 0 &&
            regex.map((current, index) => (
              <p
                className={current.valid ? styles.valid : styles.invalid}
                key={index}
              >
                <img src={current.valid ? iconMatch : iconNotMatch} />
                {current.msj}
              </p>
            ))}
        </div>
      </div>

      <RepeatPassword />
    </>
  );
};
