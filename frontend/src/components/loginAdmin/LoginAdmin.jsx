import styles from "./LoginAdmin.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconAdmin from "../../assets/img/admin.png";
import { LoginForm } from "./loginForm/LoginForm";
import { Helmet } from "react-helmet-async";

export const LoginAdmin = () => {
  return (
    <div className={styles.background}>
      <Helmet>
        <title>Login-Administracion</title>
        <meta name="robots" content="noindex"></meta>
      </Helmet>
      <div className={styles.login}>
        <div className={styles.containForm}>
          <div className={styles.header}>
            <div className={styles.title}>
              <img src={iconLogo}></img>
              <h3>Indice delitos Montevideo</h3>
              <span>Iniciar sesión</span>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};
