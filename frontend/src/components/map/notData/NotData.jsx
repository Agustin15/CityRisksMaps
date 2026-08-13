import iconNotData from "../../../assets/img/notData.png";
import iconNotDataMobile from "../../../assets/img/notDataAlert.png";
import { useNeighborhoodsCrimes } from "../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useWindowResize } from "../../../contexts/WindowResizeContext";
import styles from "./NotData.module.css";

export const NotData = () => {
  const { errorLoad } = useNeighborhoodsCrimes();
  const { windowWidth } = useWindowResize();

  return (
    <div className={styles.notData}>
      <img src={windowWidth >= 1200 ? iconNotData : iconNotDataMobile}></img>
      <span>{errorLoad}</span>
    </div>
  );
};
