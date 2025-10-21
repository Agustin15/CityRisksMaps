import myLocation from "../../../assets/img/myLocation.png";
import styles from "./MyGeolocation.module.css";
import { useMapControls } from "../../../contexts/MapContext";

export const MyGeolocation = () => {
  const { handleMyLocation, loadingMyLocation } = useMapControls();
  
  return (
    <div className={styles.containGeolocation}>
      <span className={loadingMyLocation ? styles.loading : styles.hideLoading}>
        Localizando...
      </span>
      <button onClick={handleMyLocation}>
        <img src={myLocation}></img>
      </button>
    </div>
  );
};
