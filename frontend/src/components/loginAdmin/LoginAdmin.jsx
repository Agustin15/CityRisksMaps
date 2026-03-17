import styles from "./LoginAdmin.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconLogin from "../../assets/img/login.png";
import iconAdmin from "../../assets/img/admin.png";
import { LoginForm } from "./loginForm/LoginForm";

export const LoginAdmin = () => {
  return (
    <div className={styles.background}>
      <div className={styles.login}>
        <div className={styles.welcome}>
          <img src={iconAdmin}></img>
          <h3>Administracion del sistema</h3>
        </div>
        <div className={styles.containForm}>
          <div className={styles.title}>
            <img src={iconLogin}></img>
            <h3>Iniciar sesion</h3>
          </div>

          <LoginForm></LoginForm>

          <div className={styles.footer}>
            <img src={iconLogo}></img>
            <span>IndiceDelitosMontevideo</span>
          </div>
        </div>
      </div>
    </div>
    
  );
};
