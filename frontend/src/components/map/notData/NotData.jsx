import iconNotData from "../../../assets/img/notData.png";
import iconNotDataMobile from "../../../assets/img/notDataAlert.png";
import { useWindowResize } from "../../../contexts/WindowResizeContext";
import { useNeighborhoodsCrimes } from "../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import styles from "./NotData.module.css";

export const NotData = () => {
  const { windowWidth } = useWindowResize();
  const { errorLoad } = useNeighborhoodsCrimes();

  return (
    <div className={styles.notData}>
      <img src={windowWidth < 1200 ? iconNotDataMobile : iconNotData}></img>
      <span>{errorLoad}</span>
    </div>
  );
};
