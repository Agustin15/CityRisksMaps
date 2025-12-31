import styles from "./EnterAdresses.module.css";
import iconDestiny from "../../../../assets/img/destinyAddress.png";
import iconOrigin from "../../../../assets/img/origin.png";
import iconShow from "../../../../assets/img/showRoutes.png";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { Advice } from "../advice/Advice.jsx";

export const EnterAdresses = ({ handleChange }) => {
  const { destiny, origin, showRoutes, loadingRoutes } = useRoutes();
  const { crimeSelected } = useZoneCrimes();
  const { showQuizes } = useQuizes();

  return (
    <div className={styles.columnShowRoutes}>
      <div className={styles.rowOne}>
        <div className={styles.origin}>
          <label>Origen:</label>
          <div className={styles.row}>
            <img src={iconOrigin}></img>
            <input
              value={origin}
              onChange={(event) => handleChange(event.target.value)}
              type="text"
            ></input>
          </div>
        </div>
        <div className={styles.destiny}>
          <label>Destino:</label>
          <div className={styles.row}>
            <img src={iconDestiny}></img>
            <input readOnly type="text" value={destiny}></input>
          </div>
        </div>
        <button
          onClick={() => showRoutes("Drive")}
          className={
            destiny.length > 0 &&
            origin.length > 0 &&
            (crimeSelected == "Asesinato" || showQuizes)
              ? styles.btnEnabled
              : styles.btnDisabled
          }
        >
          Mostrar rutas
          <img src={iconShow}></img>
        </button>
      </div>
      {crimeSelected != "Asesinato" && !showQuizes && <Advice />}
      {loadingRoutes && (
        <div className={styles.containLoaderRoutes}>
          Cargando rutas
          <span className={styles.loaderRoutes}></span>
        </div>
      )}
    </div>
  );
};
