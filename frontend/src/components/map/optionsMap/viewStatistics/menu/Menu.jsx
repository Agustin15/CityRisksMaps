import styles from "./Menu.module.css";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useRoutes } from "../../../../../contexts/routesContext/RoutesContext";
import { alertSwalWarning } from "../../../../sweetAlert/sweetAlert.js";
import { Item } from "./item/Item.jsx";

export const Menu = ({ crimes, showViewStatistics, setShowViewStatistics }) => {
  const { setCrimeSelected, handleClose } = useZoneCrimes();
  const { setShowQuizes, showQuizes, loadDataQuizes } = useQuizes();
  const { routes } = useRoutes();

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
        <Item
          key={index}
          crime={crime}
          setShowViewStatistics={setShowViewStatistics}
          showViewStatistics={showViewStatistics}
        />
      ))}
    </ul>
  );
};
