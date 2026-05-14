import styles from "./FilterYears.module.css";
import { useNeighborhoodsCrimes } from "../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";

export const FilterYears = ({ categoryCrime }) => {
  const { loadCrimesByYear, years, yearSelected, setIndexChartActive } =
    useNeighborhoodsCrimes();

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
      {years.map((year, index) => (
        <li key={index}>
          <button
            onClick={() => handleClickYear(year)}
            className={
              year == yearSelected ? styles.yearSelected : styles.yearUnselected
            }
          >
            {year}
          </button>
        </li>
      ))}
    </ul>
  );
};
