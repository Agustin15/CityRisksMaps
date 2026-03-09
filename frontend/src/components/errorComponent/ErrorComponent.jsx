import styles from "./errorComponent.module.css";
import iconLogo from "../../assets/img/logo.png";

export const ErrorComponent = ({ title, msj, image }) => {
  return (
    <div className={styles.errorComponentPage}>
      <div className={styles.msj}>
        <img src={image}></img>
        <h3>{title}</h3>
        <p>{msj}</p>
      </div>

      <div className={styles.footer}>
        <img src={iconLogo}></img>
        <span>IndiceDelitosMontevideo</span>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#1e72aa"
          fillOpacity="1"
          d="M0,160L48,160C96,160,192,160,288,144C384,128,480,96,576,96C672,96,768,128,864,133.3C960,139,1056,117,1152,96C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};
