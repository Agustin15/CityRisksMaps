import iconDestiny from "../../../assets/img/destiny.png";
import styles from "./BtnIndications.module.css";

export const BtnIndications = () => {
  return (
    <button className={styles.buttonStartRoute}>
      <img src={iconDestiny}></img>
    </button>
  );
};
