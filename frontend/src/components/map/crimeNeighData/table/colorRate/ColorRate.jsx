import styles from "./ColorRate.module.css";
import { useNeighborhoodsCrimes } from "../../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";

export const ColorRate = ({ rate, crime }) => {
  const { getCrimeRange } = useNeighborhoodsCrimes();

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
