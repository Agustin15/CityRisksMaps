import styles from "./Geolocation.module.css";
import iconGeolocation from "../../../../assets/img/myLocation.png";
import iconNonGeolocation from "../../../../assets/img/nonLocation.png";
import { useMapControls } from "../../../../contexts/MapContext";

export const Geolocation = () => {
  const { handleMyLocation, loadingMyLocation, userLocation, errorLocation } =
    useMapControls();

  return (
    <div className={styles.geolocation}>
      {(loadingMyLocation || errorLocation) && (
        <li>
          <span>{loadingMyLocation ? "Localizando..." : errorLocation}</span>
        </li>
      )}
      <button
        className={userLocation ? styles.location : styles.nonLocation}
        onClick={() => handleMyLocation("current")}
      >
        <img src={userLocation ? iconGeolocation : iconNonGeolocation}></img>
      </button>
    </div>
  );
};
