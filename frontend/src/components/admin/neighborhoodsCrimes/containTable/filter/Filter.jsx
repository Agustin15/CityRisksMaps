import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import styles from "./Filter.module.css";
import { Years } from "./years/Years";

export const Filter = ({ crimes }) => {
  const { crimeSelected, setCrimeSelected, years, yearSelected } = useCrud();

  const handleCrimeSelect = (crime) => {
    setCrimeSelected(crime.category);
  };

  return (
    <div className={styles.filter}>
      <ul className={styles.crimes}>
        {crimes.map((crime, index) => (
          <li key={crime.category}>
            <button
              style={{
                borderTopLeftRadius: index == 0 ? "5px" : "0px",
                borderBottomLeftRadius: index == 0 ? "5px" : "0px",
                borderBottomRightRadius:
                  index + 1 == crimes.length ? "5px" : "0px",
                borderTopRightRadius: index + 1 == crimes.length ? "5px" : "0px"
              }}
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
