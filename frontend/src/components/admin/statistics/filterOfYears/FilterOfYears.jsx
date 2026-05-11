import styles from "../Statistics.module.css";
import { useEffect } from "react";
import { loadData } from "../functions.js";

export const FilterOfYears = ({
  years,
  setYears,
  setYearSelected,
  setLoading,
  setError
}) => {
  const loadFilter = async () => {
    setLoading(true);
    try {
      const years = await loadData("/neighborhoodCrimeAdmin/allYears");
      setYears(years);
      setYearSelected(Object.values(years[0]));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilter();
  }, []);

  return (
    <div className={styles.containSelect}>
      <select onChange={(event) => setYearSelected(event.target.value)}>
        {years.length > 0 &&
          years.map((year, index) => (
            <option value={Object.values(year)} key={index}>
              {Object.values(year)}
            </option>
          ))}
      </select>
    </div>
  );
};
