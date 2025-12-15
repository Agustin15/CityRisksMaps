import styles from "./OptionsAddress.module.css";
import iconMyLocation from "../../../../assets/img/useMyLocation.png";

export const OptionsAddress = ({suggestions}) => {
  return (
    <ul className={styles.optionsAddress}>
      <li>
        <div className={styles.icon}>
          <img src={iconMyLocation}></img>
        </div>
        Mi ubicacion
      </li>
    </ul>
  );
};
