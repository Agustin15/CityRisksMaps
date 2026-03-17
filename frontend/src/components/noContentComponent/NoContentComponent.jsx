import styles from "./NoContentComponent.module.css";
import iconLogo from "../../assets/img/logo.png";

export const NoContentComponent = ({ title, msj, image }) => {
  return (
    <div className={styles.noContentComponentPage}>
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
