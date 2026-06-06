import { Help } from "./help/Help";
import { Geolocation } from "./geolocation/Geolocation";
import styles from "./MenuOnMap.module.css";

export const MenuOnMap = () => {
  return (
    <div className={styles.menuOnMap}>
      <Geolocation />
      <Help />
    </div>
  );
};
