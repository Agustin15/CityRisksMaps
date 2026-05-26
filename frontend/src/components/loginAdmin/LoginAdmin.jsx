import styles from "./LoginAdmin.module.css";
import iconAdmin from "../../assets/img/admin.png";
import { useEffect, useState } from "react";
import { fetchVerifyAllowToAccess } from "./functions.js";
import { LoginForm } from "./loginForm/LoginForm";
import { Helmet } from "react-helmet-async";

export const LoginAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [allowAccess, setAllowAccess] = useState(false);

  useEffect(() => {
    fetchVerifyAllowToAccess(setLoading, setAllowAccess);
  }, []);

  return (
    <>
      {loading == false && allowAccess == true && (
        <div className={styles.background}>
          <Helmet>
            <title>Login-Administracion</title>
            <meta name="robots" content="noindex"></meta>
          </Helmet>
          <div className={styles.login}>
            <div className={styles.containForm}>
              <div className={styles.header}>
                <div className={styles.title}>
                  <img src={iconAdmin}></img>
                  <h3>Indice delitos Montevideo</h3>
                  <span>Iniciar sesión</span>
                </div>
              </div>

              <LoginForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
