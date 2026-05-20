import styles from "../LoginAdmin.module.css";
import iconHidePassword from "../../../assets/img/hidePassword.png";
import iconShowPassword from "../../../assets/img/showPassword.png";
import { submitForm } from "./functions.js";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext.jsx";
import { alertSwalErrorAdmin } from "../../sweetAlert/sweetAlert.js";

export const LoginForm = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  let navigate = useNavigate();

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
    try {
      const result = await submitForm(values, errors, setErrors);
      if (!result) return;

      if (!result.token2FA) {
        setUser(result.user);
        navigate("/admin/departamentos");
      } else {
        navigate("/admin/login/" + result.token2FA);
      }
    } catch (error) {
      alertSwalErrorAdmin("Autenticacion fallida", error.message);
    } finally {
      setLoading(false);
    }
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
          className={styles.password}
          placeholder="Ingrese contraseña"
          type={showPassword ? "text" : "password"}
          onChange={(event) => handleChange(event)}
        ></input>
        <img
          onClick={() => {
            if (showPassword) setShowPassword(false);
            else setShowPassword(true);
          }}
          src={showPassword ? iconShowPassword : iconHidePassword}
        ></img>
        <p>{errors.password}</p>
      </div>

      <button disabled={loading} type="submit">
        {loading ? "Iniciando sesion..." : "Iniciar sesion"}
      </button>
    </form>
  );
};
