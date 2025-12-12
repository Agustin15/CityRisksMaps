import iconNotData from "../../../assets/img/notData.png";
import styles from "./NotData.module.css";

export const NotData = ({ error }) => {
  return (
    <div className={styles.notData}>
      <img src={iconNotData}></img>
      <span>{error ? error : "Sin datos"}</span>
    </div>
  );
};
