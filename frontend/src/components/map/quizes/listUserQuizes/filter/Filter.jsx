import iconNotData from "../../../../../assets/img/notData.png";
import { useListQuizes } from "../../../../../contexts/quizesContext/ListQuizesContext";
import styles from "./Filter.module.css";

export const Filter = () => {
  const {
    years,
    loadingYears,
    errorSearch,
    refSelectYear,
    setIndex,
    loadQuizes
  } = useListQuizes();

  const handleSearch = async () => {
    setIndex(0);
    await loadQuizes(refSelectYear.current.value, 0);
  };

  return (
    <div className={styles.containFilter}>
      {loadingYears == true && (
        <span className={styles.loading}>Cargando años...</span>
      )}

      {loadingYears == false && !years && (
        <div className={styles.notData}>
          <img src={iconNotData}></img>
          {errorSearch}
        </div>
      )}

      {loadingYears == false && years && (
        <div className={styles.filter}>
          <label>Buscar por año:</label>
          <div className={styles.row}>
            <select ref={refSelectYear}>
              {years.map((yearObject) => (
                <option value={Object.values(yearObject)}>
                  {Object.values(yearObject)}
                </option>
              ))}
            </select>
            <button onClick={() => handleSearch()}>Buscar</button>
          </div>
        </div>
      )}
    </div>
  );
};
