import styles from "./Origin.module.css";
import iconOrigin from "../../../../../assets/img/origin.png";
import iconSearch from "../../../../../assets/img/search.png";
import { useRoutes } from "../../../../../contexts/routesContext/RoutesContext";

export const Origin = ({ handleChange, handleSearchSuggestions, loading }) => {
  const { origin } = useRoutes();

  return (
    <div className={styles.origin}>
      <label>Origen:</label>
      <div className={styles.row}>
        <img src={iconOrigin}></img>
        <div className={styles.containInput}>
          <input
            value={origin}
            onChange={(event) => handleChange(event.target.value)}
            type="text"
          ></input>
          {origin && origin.length > 0 && (
            <button className={styles.search} disabled={loading}>
              {!loading ? (
                <img
                  onClick={() => handleSearchSuggestions()}
                  src={iconSearch}
                ></img>
              ) : (
                <span className={styles.loader}></span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
