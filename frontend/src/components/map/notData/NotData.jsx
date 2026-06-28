import iconNotDataMobile from "../../../assets/img/notDataAlert.png";
import { useNeighborhoodsCrimes } from "../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import styles from "./NotData.module.css";

export const NotData = () => {
  const { errorLoad } = useNeighborhoodsCrimes();

  return (
    <div className={styles.notData}>
      <img src={iconNotDataMobile}></img>
      <span>{errorLoad}</span>
    </div>
  );
};
