import { useEffect, useState } from "react";
import iconMatch from "../../../../../assets/img/match.png";
import iconNotMatch from "../../../../../assets/img/notMatch.png";
import styles from "./NewPassword.module.css";

export const NewPassword = ({ regex, errors, values, handleChange }) => {
  return (
    <div className={styles.columnInput}>
      <label>Contraseña nueva</label>
      <input
        name="newPassword"
        value={values.newPassword}
        onChange={() => handleChange(event)}
        placeholder="Ingrese nueva contraseña"
        type="password"
      ></input>
      {values.newPassword.length == 0 && errors.newPassword.length > 0 && (
        <p>*{errors.newPassword}</p>
      )}

      {values.newPassword.length > 0 && (
        <div className={styles.containerRegex}>
          {regex.map((current, index) => (
            <p
              className={current.valid ? styles.valid : styles.invalid}
              key={index}
            >
              <img src={current.valid ? iconMatch : iconNotMatch} />
              {current.msj}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
