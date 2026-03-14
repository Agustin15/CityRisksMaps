import iconNotData from "../../../assets/img/notData.png";
import iconNotDataMobile from "../../../assets/img/notDataAlert.png";
import { useWindowResize } from "../../../contexts/WindowResizeContext";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import styles from "./NotData.module.css";

export const NotData = () => {
  const { windowWidth } = useWindowResize();
  const { errorLoad } = useZoneCrimes();

  return (
    <div className={styles.notData}>
      <img src={windowWidth < 1200 ? iconNotDataMobile : iconNotData}></img>
      <span>{errorLoad}</span>
    </div>
  );
};
