import styles from "./Menu.module.css";
import iconKill from "../../../../../assets/img/kill.png";
import iconTheft from "../../../../../assets/img/theft.png";
import iconHoldup from "../../../../../assets/img/holdup.png";
import iconQuizes from "../../../../../assets/img/quizes.png";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useRoutes } from "../../../../../contexts/routesContext/RoutesContext";
import { alertSwalWarning } from "../../../../sweetAlert/sweetAlert.js";

export const Menu = ({ crimes }) => {
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
        handleClose();
        loadCrimeDataNeighborhoods(crime.category);
        setCrimeSelected(crime.category);
        setShowQuizes();
      }
    }
  };

  const handleClickQuizes = () => {
    if (!showQuizes) {
      if (routes) {
        alertSwalWarning(
          "Tiene que salir del modo navegacion para elegir otra opcion"
        );
      } else {
        handleClose();
        setCrimeSelected();
        loadDataQuizes();
        setShowQuizes(true);
      }
    }
  };

  return (
    <ul className={styles.menuOptionsCrimes}>
      <li
        className={showQuizes ? styles.selected : ""}
        onClick={handleClickQuizes}
      >
        <img src={iconQuizes}></img>
        Encuestas
      </li>

      {crimes.map((crime, index) => (
        <li
          className={crime.category == crimeSelected ? styles.selected : ""}
          key={index}
          onClick={() => handleClickOption(crime)}
        >
          <img
            src={
              crime.category == "Hurto"
                ? iconTheft
                : crime.category == "Rapiña"
                ? iconHoldup
                : crime.category == "Homicidio"
                ? iconKill
                : ""
            }
          ></img>
          {crime.category}
        </li>
      ))}
    </ul>
  );
};
