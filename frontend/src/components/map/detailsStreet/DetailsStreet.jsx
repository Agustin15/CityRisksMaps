import styles from "./DetailsStreet.module.css";
import { BtnIndications } from "../BtnIndications/BtnIndications";

export const DetailsStreet = ({ infoWindow, setInfoWindow }) => {
  return (
    <div className={styles.containDetailsStreet}>
      <div className={styles.close}>
        <span onClick={() => setInfoWindow(false)}>x</span>
      </div>
      <div className={styles.row}>
        <div className={styles.column}>
          <h3>Direccion:</h3>
          <p>{infoWindow.results[0].formatted_address}</p>
        </div>
        <BtnIndications />
      </div>
    </div>
  );
};
