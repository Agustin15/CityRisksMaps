import styles from "../Menu.module.css";
import { alertSwalWarning } from "../../../../../sweetAlert/sweetAlert.js";
import { useRoutes } from "../../../../../../contexts/routesContext/RoutesContext.jsx";
import { useZoneCrimes } from "../../../../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useNavigation } from "../../../../../../contexts/navigationContext/NavigationContext.jsx";

export const Item = ({ crime, setShowViewStatistics, showViewStatistics }) => {
  const {
    loadCrimeDataNeighborhoods,
    crimeSelected,
    setCrimeSelected,
    handleClose
  } = useZoneCrimes();

  const { routes } = useRoutes();
  const { routeNavigation } = useNavigation();

  const handleClickOption = (crime) => {
    if (crime.category != crimeSelected) {
      if (routes || routeNavigation) {
        alertSwalWarning(
          "Tiene que salir del modo navegacion para elegir otra opcion"
        );
      } else {
        if (!showViewStatistics) setShowViewStatistics(true);

        handleClose();
        loadCrimeDataNeighborhoods(crime.category);
        setCrimeSelected(crime.category);
      }
    } else if (!showViewStatistics) setShowViewStatistics(true);
  };

  return (
    <li
      className={crime.category == crimeSelected ? styles.selected : ""}
      onClick={() => handleClickOption(crime)}
    >
      <div
        className={
          crime.category == "Hurto"
            ? styles.theft
            : crime.category == "Rapiña"
              ? styles.holdup
              : crime.category == "Homicidio"
                ? styles.kill
                : ""
        }
      ></div>
      {crime.category}
    </li>
  );
};
