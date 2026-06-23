import styles from "./ConfirmationForm.module.css";
import iconAuth2FA from "../../../../../../assets/img/auth2FA.png";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext";
import { fetchUpdateStateAuth2FA } from "./functions.js";
import { alertSwalErrorAdmin } from "../../../../../sweetAlert/sweetAlert.js";

export const ConfirmationForm = ({ setShow2FAForm }) => {
  const { user, setUser } = useAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEnabled = user?.auth2FA;
  const title = isEnabled
    ? "Deshabilitar autenticacion de dos pasos"
    : "Habilitar autenticacion de dos pasos";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Debe confirmar su contraseña");
      return;
    }

    try {
      setLoading(true);
      await fetchUpdateStateAuth2FA(isEnabled, user, setUser, password);
    } catch (error) {
      alertSwalErrorAdmin(
        `Ups,algo salio mal al ${isEnabled ? "deshabilitar" : "habilitar la 2FA"} `,
        error.message || "Error en la solicitud"
      );
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    document.querySelector("body").style.overflowY = "scroll";
    setShow2FAForm(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={iconAuth2FA} className={styles.icon} />
        <h2>{title}</h2>
        <button onClick={close}>Cerrar</button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.containInput}>
          <label htmlFor="password">Ingresa tu contraseña:</label>
          <input
            autoComplete="off"
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <p className={styles.error}>*{error}</p>}
        </div>

        <button
          type="submit"
          className={`${styles.button} ${
            isEnabled ? styles.buttonDisable : styles.buttonEnable
          }`}
          disabled={loading}
        >
          {loading ? "Procesando..." : isEnabled ? "Deshabilitar" : "Habilitar"}
        </button>
      </form>
    </div>
  );
};
