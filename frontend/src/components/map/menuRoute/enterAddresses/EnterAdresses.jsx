import styles from "./EnterAdresses.module.css";
import iconDestination from "../../../../assets/img/destinationAddress.png";
import iconShow from "../../../../assets/img/showRoutes.png";
import { Advice } from "../advice/Advice.jsx";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { Origin } from "./origin/Origin.jsx";

export const EnterAdresses = ({
  handleChange,
  handleSearchSuggestions,
  loading
}) => {
  const { destination, originLocation, showRoutes, loadingRoutes } =
    useRoutes();
  const { crimeSelected } = useZoneCrimes();
  const { showQuizes } = useQuizes();

  const handleClickShowRoutes = () => {
    if (destination.length > 0 && originLocation) showRoutes("Drive");
    else return;
  };

  return (
    <div className={styles.columnShowRoutes}>
      <div className={styles.enterAdresses}>
        <Origin
          handleChange={handleChange}
          handleSearchSuggestions={handleSearchSuggestions}
          loading={loading}
        />

        <div className={styles.destination}>
          <label>Destino:</label>
          <div className={styles.row}>
            <img src={iconDestination}></img>
            <input readOnly type="text" value={destination}></input>
          </div>
        </div>
        <button
          disabled={loadingRoutes}
          onClick={handleClickShowRoutes}
          className={
            destination.length > 0 && originLocation
              ? styles.btnEnabled
              : styles.btnDisabled
          }
        >
          Mostrar rutas
          <img src={iconShow}></img>
        </button>
      </div>

      {crimeSelected != "Homicidio" && !showQuizes && <Advice />}
      {loadingRoutes && (
        <div className={styles.containLoaderRoutes}>
          Cargando rutas
          <span className={styles.loaderRoutes}></span>
        </div>
      )}
    </div>
  );
};
