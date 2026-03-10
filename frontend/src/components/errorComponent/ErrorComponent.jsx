import styles from "./errorComponent.module.css";
import iconLogo from "../../assets/img/logo.png";

export const ErrorComponent = ({ title, msj, image }) => {
  return (
    <div className={styles.errorComponentPage}>
      <div className={styles.wave}></div>
      <div className={styles.msj}>
        <img src={image}></img>
        <h3>{title}</h3>
        <p>{msj}</p>
      </div>

      <div className={styles.footer}>
        <img src={iconLogo}></img>
        <span>IndiceDelitosMontevideo</span>
      </div>
    </div>
  );
};
