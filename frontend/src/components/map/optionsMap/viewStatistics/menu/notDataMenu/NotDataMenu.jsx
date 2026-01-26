import styles from "./NotDataMenu.module.css";
import iconNotData from "../../../../../../assets/img/notData.png";

export const NotDataMenu = () => {
  return (
    <div className={styles.notDataMenu}>
      <img src={iconNotData}></img>
      <p>Sin datos</p>
    </div>
  );
};
