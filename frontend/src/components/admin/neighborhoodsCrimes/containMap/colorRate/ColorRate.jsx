import styles from "./ColorRate.module.css";
import { getCrimeRange } from "../../../../../contexts/neighborhoodsCrimesContext/functionsCreatePolygons";

export const ColorRate = ({ rate, crime }) => {
  return (
    <div
      style={{
        background:
          rate == null
            ? "#bbbbbbff"
            : getCrimeRange(rate.toFixed(0), crime).color
      }}
      className={styles.referenceRate}
    ></div>
  );
};
