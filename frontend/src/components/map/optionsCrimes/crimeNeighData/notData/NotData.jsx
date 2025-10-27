import iconNotData from "../../../../../assets/img/notData.png";
import styles from "./NotData.module.css";

export const NotData = () => {
  return (
    <div className={styles.notData}>
      <img src={iconNotData}></img>
      <span>Sin datos</span>
    </div>
  );
};
