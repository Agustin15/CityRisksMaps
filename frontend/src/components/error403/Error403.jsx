import styles from "./Error403.module.css";
import iconForbbiden from "../../assets/img/forbidden.png";
import iconLogo from "../../assets/img/logo.png";
import { Helmet } from "react-helmet-async";

export const Error403 = () => {
  return (
    <div className={styles.forbidden}>
      <Helmet>
        <meta name="robots" content="noindex"></meta>
      </Helmet>
      <div className={styles.wave}></div>

      <div className={styles.msj}>
        <img src={iconForbbiden}></img>
        <h3>Acceso denegado</h3>
        <p>No posee permisos suficientes para acceder a este recurso</p>
      </div>

      <div className={styles.footer}>
        <img src={iconLogo}></img>
        <span>IndiceDelitosMontevideo</span>
      </div>
    </div>
  );
};
