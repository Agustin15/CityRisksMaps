import styles from "../Password.module.css";
import iconShowPassword from "../../../../../assets/img/showPassword.png";
import iconHidePassword from "../../../../../assets/img/hidePassword.png";
import { useState } from "react";
import { useActivateUser } from "../../../../../contexts/adminContext/ActivateUserContext";

export const RepeatPassword = () => {
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { values, setValues, errorForm } = useActivateUser();

  return (
    <div className={styles.columnInput}>
      <label>Repetir contraseña:</label>

      <input
        autoComplete="off"
        name="repeatPassword"
        onChange={(event) =>
          setValues({
            ...values,
            repeatPassword: event.target.value
          })
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
  );
};
