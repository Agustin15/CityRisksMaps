import styles from "./UpdateEmail.module.css";
import iconChangeEmail from "../../../../../assets/img/changeEmail.png";
import { useEffect, useState } from "react";
import { fetchUpdateEmail } from "./functions.js";
import { useAuth } from "../../../../../contexts/adminContext/AuthContext";
import {
  alertSwalSuccess,
  alertSwalWarning
} from "../../../../sweetAlert/sweetAlert";

export const UpdateEmail = ({ setChangeEmail }) => {
  const [values, setValues] = useState({
    newEmail: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    newEmail: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues({ ...values, [name]: value });

    switch (name) {
      case "newEmail":
        let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regexEmail.test(values.newEmail))
          setErrors({ ...errors, newEmail: "Formato de correo no valido" });
        else setErrors({ ...errors, newEmail: "" });
        break;
      case "password":
        if (values.password.length == 0)
          setErrors({ ...errors, password: "Debe indicar su contraseña" });
        else setErrors({ ...errors, password: "" });
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(values).some((value) => value.length == 0))
      return alertSwalWarning("Debe completar los campos");

    if (Object.values(errors).some((error) => error.length > 0)) return;

    const result = await fetchUpdateEmail(
      setLoading,
      setUser,
      values,
      user.idUser
    );

    if (result) {
      alertSwalSuccess(
        "¡Se le ha enviado un mensaje a su casilla de correo para verificar su " +
          "nuevo correo electronico!"
      );
      setValues({ newEmail: "", password: "" });
    }
  };

  return (
    <div className={styles.updateEmail}>
      <div className={styles.header}>
        <img src={iconChangeEmail}></img>
        <h3>Actualizar correo electronico</h3>
        <button onClick={() => setChangeEmail(false)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <form onSubmit={() => handleSubmit(event)}>
        <div className={styles.columnInput}>
          <label>Correo</label>
          <input
            autoComplete="off"
            onChange={() => handleChange(event)}
            name="newEmail"
            value={values.newEmail}
            placeholder="Ingrese su nuevo correo"
            type="email"
          ></input>
          {errors.newEmail.length > 0 && <p>*{errors.newEmail}</p>}
        </div>

        <div className={styles.columnInput}>
          <label>Contraseña</label>
          <input
            autoComplete="off"
            onChange={() => handleChange(event)}
            name="password"
            value={values.password}
            placeholder="Ingrese su contraseña"
            type="password"
          ></input>
          {errors.password.length > 0 && <p>*{errors.password}</p>}
        </div>
        <button disabled={loading} type="submit" className={styles.save}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};
