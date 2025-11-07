import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import styles from "./FilterYears.module.css";

export const FilterYears = ({ categoryCrime }) => {
  const { loadCrimesByYear, years, yearSelected, setIndexChartActive } =
    useZoneCrimes();

  const getCrimesByYear = async (yearSelected) => {
    setIndexChartActive(null);
    loadCrimesByYear(yearSelected, categoryCrime);
  };

  return (
    <ul className={styles.years}>
      {years.map((yearObject, index) => (
        <li key={index}>
          <button
            onClick={() => getCrimesByYear(yearObject.year)}
            className={
              yearObject.year == yearSelected
                ? styles.yearSelected
                : styles.yearUnselected
            }
          >
            {yearObject.year}
          </button>
        </li>
      ))}
    </ul>
  );
};
