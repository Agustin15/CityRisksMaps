import iconNotData from "../../../assets/img/notData.png";
import iconNotDataMobile from "../../../assets/img/notDataAlert.png";
import { useWindowResize } from "../../../contexts/WindowResizeContext";
import styles from "./NotData.module.css";

export const NotData = ({ error }) => {
  const { windowWidth } = useWindowResize();

  return (
    <div className={styles.notData}>
      <img src={windowWidth < 1200 ? iconNotDataMobile : iconNotData}></img>
      <span>{error ? error : "Sin datos"}</span>
    </div>
  );
};
