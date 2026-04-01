import styles from "./FilterYears.module.css";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext";

export const FilterYears = ({ categoryCrime }) => {
  const { loadCrimesByYear, years, yearSelected, setIndexChartActive } =
    useZoneCrimes();

  const getCrimesByYear = async (yearSelected) => {
    loadCrimesByYear(yearSelected, categoryCrime);
  };

  const handleClickYear = (yearSelected) => {
    setIndexChartActive(null);
    if (categoryCrime) {
      getCrimesByYear(yearSelected);
    }
  };

  return (
    <ul className={styles.years}>
      {years.map((yearObject, index) => (
        <li key={index}>
          <button
            onClick={() => handleClickYear(yearObject.year)}
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
