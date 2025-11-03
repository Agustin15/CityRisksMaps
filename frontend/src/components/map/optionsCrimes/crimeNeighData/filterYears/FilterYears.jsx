import styles from "./FilterYears.module.css";

export const FilterYears = ({ years, yearSelected }) => {
  return (
    <ul className={styles.years}>
      {years.map((yearObject, index) => (
        <li key={index}>
          <button
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
