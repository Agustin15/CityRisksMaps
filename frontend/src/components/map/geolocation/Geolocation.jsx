import iconGeolocation from "../../../assets/img/myLocation.png";
import { useMapControls } from "../../../contexts/MapContext";
import styles from "./Geolocation.module.css";

export const Geolocation = () => {
  const { handleMyLocation, loadingMyLocation } = useMapControls();

  return (
    <div className={styles.geolocation}>
      {loadingMyLocation && (
        <li>
          <span>Localizando...</span>
        </li>
      )}
      <button onClick={handleMyLocation}>
        <img src={iconGeolocation}></img>
      </button>
    </div>
  );
};
