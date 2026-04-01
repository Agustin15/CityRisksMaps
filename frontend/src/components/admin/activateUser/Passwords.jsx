import { useState } from "react";
import iconShowPassword from "../../../assets/img/showPassword.png";
import iconHidePassword from "../../../assets/img/hidePassword.png";
import styles from "./activateUser.module.css";

export const Passwords = ({ values, setValues, errorForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <>
      <div className={styles.columnInput}>
        <label>Contraseña:</label>
        <input
          autoComplete="off"
          name="password"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, password: event.target.value }))
          }
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

        {errorForm && errorForm.includes("contraseña") && <p>{errorForm}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Repetir contraseña:</label>

        <input
          autoComplete="off"
          name="repeatPassword"
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              repeatPassword: event.target.value
            }))
          }
          placeholder="Repita la contraseña"
          type={showRepeatPassword ? "text" : "password"}
          value={values.repeatPassword}
        />
        <button
          type="button"
          className={styles.btnPassword}
          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
        >
          {showRepeatPassword ? (
            <img src={iconShowPassword} />
          ) : (
            <img src={iconHidePassword} />
          )}
        </button>

        {errorForm && errorForm.includes("contraseñas no coinciden") && (
          <p>{errorForm}</p>
        )}
      </div>
    </>
  );
};
