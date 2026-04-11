import styles from "./EnterAdresses.module.css";
import iconShow from "../../../../assets/img/showRoutes.png";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { Advice } from "../advice/Advice.jsx";
import { Origin } from "./origin/Origin.jsx";

export const EnterAdresses = ({
  handleChange,
  handleSearchSuggestions,
  loading
}) => {
  const { destination, originLocation, showRoutes, loadingRoutes } =
    useRoutes();
  const { crimeSelected } = useNeighborhoodsCrimes();

  const handleClickShowRoutes = () => {
    if (
      destination.length > 0 &&
      originLocation &&
      (crimeSelected == "Homicidio" || crimeSelected == "Rapiña")
    )
      showRoutes("Drive");
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
            <input readOnly type="text" value={destination}></input>
          </div>
        </div>
        <button
          disabled={loadingRoutes}
          onClick={handleClickShowRoutes}
          className={
            destination.length > 0 &&
            originLocation &&
            (crimeSelected == "Homicidio" || crimeSelected == "Rapiña")
              ? styles.btnEnabled
              : styles.btnDisabled
          }
        >
          Mostrar rutas
          <img src={iconShow}></img>
        </button>
      </div>

      {crimeSelected != "Homicidio" ||
        (crimeSelected != "Rapiña" && <Advice />)}
      {loadingRoutes && (
        <div className={styles.containLoaderRoutes}>
          Cargando rutas
          <span className={styles.loaderRoutes}></span>
        </div>
      )}
    </div>
  );
};
