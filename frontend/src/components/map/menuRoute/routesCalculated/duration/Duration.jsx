import styles from "./Duration.module.css";
import { convertDuration, convertDistance } from "../functions.js";

export const Duration = ({route}) => {
  return (
    <div className={styles.columnTwo}>
      <span className={styles.duration}>
        {convertDuration(parseInt(route.duration))}
      </span>
      <span>{convertDistance(parseInt(route.distanceMeters))}</span>
    </div>
  );
};
