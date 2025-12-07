import styles from "./ColorRate.module.css";
import { useZoneCrimes } from "../../../../../../contexts/ZoneCrimesContext";

export const ColorRate = ({ rate, crime }) => {
  const { getCrimeRange } = useZoneCrimes();

  return (
    <div
      style={{
        background: rate == null ? "#bbbbbbff" : getCrimeRange(rate, crime).color
      }}
      className={styles.referenceRate}
    ></div>
  );
};
