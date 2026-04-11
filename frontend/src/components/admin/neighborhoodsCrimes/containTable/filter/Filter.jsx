import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import styles from "./Filter.module.css";
import { Years } from "./years/Years";

export const Filter = ({ crimes }) => {
  const { crimeSelected, setCrimeSelected, years, yearSelected } = useCrud();

  const handleCrimeSelect = (crime) => {
    setCrimeSelected(
      crimeSelected.category == crime.category ? null : crime.category
    );
  };

  return (
    <div className={styles.filter}>
      <ul className={styles.crimes}>
        {crimes.map((crime) => (
          <li key={crime.category}>
            <button
              onClick={() => handleCrimeSelect(crime)}
              className={
                crimeSelected == crime.category
                  ? styles.crimeBtnSelected
                  : styles.crimeBtn
              }
            >
              {crime.category}
            </button>
          </li>
        ))}
      </ul>
      {years && <Years years={years} yearSelected={yearSelected} />}
    </div>
  );
};
