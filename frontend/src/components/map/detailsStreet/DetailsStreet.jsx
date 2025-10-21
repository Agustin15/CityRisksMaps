import styles from "./DetailsStreet.module.css";
import { BtnIndications } from "../BtnIndications/BtnIndications";

export const DetailsStreet = ({ infoWindow }) => {
 
  return (
    <div className={styles.containDetailsStreet}>
      <div className={styles.column}>
        <h3>{infoWindow.address_descriptor.areas[0].display_name.text}</h3>
        <span>
          {infoWindow.results[infoWindow.results.length - 2].formatted_address}
        </span>
      </div>
      <BtnIndications />
    </div>
  );
};
