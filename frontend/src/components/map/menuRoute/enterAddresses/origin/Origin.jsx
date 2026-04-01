import styles from "./Origin.module.css";
import iconSearch from "../../../../../assets/img/search.png";
import { useRoutes } from "../../../../../contexts/routesContext/RoutesContext";

export const Origin = ({ handleChange, handleSearchSuggestions, loading }) => {
  const { origin } = useRoutes();

  return (
    <div className={styles.origin}>
      <label>Origen:</label>
      <div className={styles.row}>
        <div className={styles.containInput}>
          <input placeholder="Ingrese direccion de origen"
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
