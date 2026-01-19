import styles from "./Menu.module.css";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useRoutes } from "../../../../../contexts/routesContext/RoutesContext";
import { alertSwalWarning } from "../../../../sweetAlert/sweetAlert.js";

export const Menu = ({ crimes, showViewStatistics, setShowViewStatistics }) => {
  const {
    loadCrimeDataNeighborhoods,
    crimeSelected,
    setCrimeSelected,
    handleClose
  } = useZoneCrimes();
  const { setShowQuizes, showQuizes, loadDataQuizes } = useQuizes();
  const { routes } = useRoutes();

  const handleClickOption = (crime) => {
    if (crime.category != crimeSelected) {
      if (routes) {
        alertSwalWarning(
          "Tiene que salir del modo navegacion para elegir otra opcion"
        );
      } else {
        if (!showViewStatistics) setShowViewStatistics(true);

        handleClose();
        loadCrimeDataNeighborhoods(crime.category);
        setCrimeSelected(crime.category);
        setShowQuizes(false);
      }
    } else if (!showViewStatistics) setShowViewStatistics(true);
  };

  const handleClickQuizes = () => {
    if (!showQuizes) {
      if (routes) {
        alertSwalWarning(
          "Tiene que salir del modo navegacion para elegir otra opcion"
        );
      } else {
        if (!showViewStatistics) setShowViewStatistics(true);

        handleClose();
        setCrimeSelected();
        loadDataQuizes();
        setShowQuizes(true);
      }
    } else if (!showViewStatistics) setShowViewStatistics(true);
  };

  return (
    <ul className={styles.menuOptionsCrimes}>
      <li
        className={showQuizes ? styles.selected : ""}
        onClick={handleClickQuizes}
      >
        <div className={styles.quiz}></div>
        <span> Encuestas</span>
      </li>

      {crimes.map((crime, index) => (
        <li
          className={crime.category == crimeSelected ? styles.selected : ""}
          key={index}
          onClick={() => handleClickOption(crime)}
        >
          <div
            className={
              crime.category == "Hurto"
                ? styles.holdup
                : crime.category == "Rapiña"
                  ? styles.theft
                  : crime.category == "Homicidio"
                    ? styles.kill
                    : ""
            }
          ></div>
          {crime.category}
        </li>
      ))}
    </ul>
  );
};
