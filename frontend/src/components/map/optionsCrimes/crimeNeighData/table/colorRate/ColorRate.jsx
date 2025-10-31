import { useZoneCrimes } from "../../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import styles from "./ColorRate.module.css";

export const ColorRate = ({ rate, crime }) => {
  const { getCrimeRange } = useZoneCrimes();

  return (
    <div
      style={{ background: rate ? getCrimeRange(rate, crime) : "#bbbbbbff" }}
      className={styles.referenceRate}
    ></div>
  );
};
