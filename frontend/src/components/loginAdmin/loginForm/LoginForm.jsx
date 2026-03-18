import styles from "../LoginAdmin.module.css";
import iconHidePassword from "../../../assets/img/hidePassword.png";
import { handleViewPassword, submitForm } from "./functions.js";
import { useCookies } from "react-cookie";
import { useRef, useState } from "react";
const localhostFrontend = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const LoginForm = () => {
  const inputPasswordRef = useRef();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies();

  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });

    if (name == "email")
      setErrors({
        ...errors,
        [name]: !regexEmail.test(value)
          ? "*Complete correctamente el campo correo"
          : ""
      });
    else if (name == "password")
      setErrors({
        ...errors,
        [name]: value.length == 0 ? "*Complete el campo contraseña" : ""
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const userFound = await submitForm(values, errors, setErrors);
    if (userFound) {
      setCookie("nameUser", userFound.name);
      location.href = localhostFrontend + "/admin/departamentos";
    }
    setLoading(false);
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <div className={styles.columnInput}>
        <label>Correo</label>
        <input
          autoComplete="off"
          name="email"
          value={values.email}
          onChange={(event) => handleChange(event)}
          placeholder="Ingrese su correo"
          type="text"
        ></input>
        <p>{errors.email}</p>
      </div>

      <div className={styles.columnInput}>
        <label>Contraseña</label>
        <input
          autoComplete="off"
          name="password"
          value={values.password}
          ref={inputPasswordRef}
          className={styles.password}
          placeholder="Ingrese contraseña"
          type="password"
          onChange={(event) => handleChange(event)}
        ></input>
        <img
          onClick={(event) => handleViewPassword(event, inputPasswordRef)}
          src={iconHidePassword}
        ></img>
        <p>{errors.password}</p>
      </div>

      <button disabled={loading} type="submit">
        {loading ? "Iniciando sesion..." : "Iniciar sesion"}
      </button>
    </form>
  );
};
