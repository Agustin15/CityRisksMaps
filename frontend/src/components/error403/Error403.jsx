import iconForbbiden from "../../assets/img/forbidden.png";
import iconLogo from "../../assets/img/logo.png";
import styles from "./Error403.module.css";

export const Error403 = () => {
  return (
    <div className={styles.forbidden}>
      <div className={styles.wave}></div>
      <div className={styles.msj}>
        <img src={iconForbbiden}></img>
        <h3>ERROR 403</h3>
        <p>No posee permisos suficientes para acceder a esta pagina</p>
      </div>

      <div className={styles.footer}>
        <img src={iconLogo}></img>
        <span>IndiceDelitosMontevideo</span>
      </div>
    </div>
  );
};
