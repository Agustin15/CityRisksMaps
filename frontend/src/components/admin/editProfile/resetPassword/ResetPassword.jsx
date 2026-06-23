import styles from "./ResetPassword.module.css";
import iconChangePassword from "../../../../assets/img/resetPassword.png";
import { NewPassword } from "./newPassword/NewPassword";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/adminContext/AuthContext.jsx";
import {
  arrayRegex,
  fetchUpdatePassword,
  validationForm
} from "./functions.js";
import { alertSwalSuccess } from "../../../sweetAlert/sweetAlert.js";

export const ResetPassword = ({ setChangePassword }) => {
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: ""
  });
  const { setUser, user } = useAuth();

  const [regex, setRegex] = useState(arrayRegex);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });

    if (event.target.name == "newPassword") {
      const newRegex = regex.map((current) => {
        current.valid = current.pattern.test(event.target.value);
        return current;
      });
      setRegex(newRegex);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsInput = validationForm(values);

    setErrors(errorsInput);

    if (
      Object.values(errorsInput).some((value) => value.length > 0) ||
      regex.some((current) => !current.valid)
    )
      return;

    const result = await fetchUpdatePassword(
      setLoading,
      setUser,
      values,
      user.idUser
    );

    if (result) {
      alertSwalSuccess("¡Contraseña actualizada exitosamente!");
      setErrors({
        oldPassword: "",
        newPassword: "",
        repeatPassword: ""
      });
      setValues({
        oldPassword: "",
        newPassword: "",
        repeatPassword: ""
      });
    }
    return;
  };

  return (
    <div className={styles.resetPassword}>
      <div className={styles.header}>
        <img src={iconChangePassword}></img>
        <h3>Actualizar contraseña</h3>
        <button
          onClick={() => setChangePassword(false)}
          className={styles.close}
        >
          Cerrar
        </button>
      </div>

      <form onSubmit={(event) => handleSubmit(event)}>
        <div className={styles.columnInput}>
          <label>Contraseña actual</label>
          <input
            onChange={() => handleChange(event)}
            name="oldPassword"
            value={values.oldPassword}
            placeholder="Ingrese su contraseña actual"
            type="password"
          ></input>
          {errors.oldPassword.length > 0 && <p>*{errors.oldPassword}</p>}
        </div>

        <NewPassword
          regex={regex}
          errors={errors}
          values={values}
          handleChange={handleChange}
        />

        <div className={styles.columnInput}>
          <label>Repetir nueva contraseña</label>
          <input
            onChange={() => handleChange(event)}
            name="repeatPassword"
            value={values.repeatPassword}
            placeholder="Vuelva a ingresar la nueva contraseña "
            type="password"
          ></input>
          {errors.repeatPassword.length > 0 && <p>*{errors.repeatPassword}</p>}
        </div>
        <button disabled={loading} type="submit" className={styles.save}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
};
