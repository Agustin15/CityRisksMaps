import styles from "../Statistics.module.css";
import { useEffect } from "react";
import { loadData } from "../functions.js";

export const FilterOfCrime = ({
  crimes,
  setCrimes,
  setCrimeSelected,
  setLoading,
  setError
}) => {
  const loadFilter = async () => {
    setLoading(true);
    try {
      const crimes = await loadData("/admin/crime/crimes");
      setCrimes(crimes);
      setCrimeSelected(crimes[0].category);
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
      <select onChange={(event) => setCrimeSelected(event.target.value)}>
        {crimes.length > 0 &&
          crimes.map((crime, index) => (
            <option value={crime.category} key={index}>
              {crime.category}
            </option>
          ))}
      </select>
    </div>
  );
};
