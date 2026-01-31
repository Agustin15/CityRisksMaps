import styles from "./Menu.module.css";
import { useState, useEffect } from "react";
import { useQuizes } from "../../../../../contexts/quizesContext/QuizesContext";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useRoutes } from "../../../../../contexts/routesContext/RoutesContext";
import { useWindowResize } from "../../../../../contexts/WindowResizeContext.jsx";
import { Item } from "./item/Item.jsx";
import { AlertMenu } from "./AlertMenu/alertMenu.jsx";
import { alertSwalWarning } from "../../../../sweetAlert/sweetAlert.js";
import { getCrimes } from "../functions.js";

export const Menu = ({
  neighbordhoodsCoordinates,
  showViewStatistics,
  setShowViewStatistics
}) => {
  const [crimes, setCrimes] = useState();
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [closeAlert, setCloseAlert] = useState(true);

  const { windowWidth } = useWindowResize();
  const { setCrimeSelected, handleClose, loadCrimeDataNeighborhoods } =
    useZoneCrimes();
  const { setShowQuizes, showQuizes, loadDataQuizes } = useQuizes();

  const { routes } = useRoutes();
  [];

  useEffect(() => {
    if (!neighbordhoodsCoordinates) return;
    loadData();
  }, [neighbordhoodsCoordinates]);

  const loadData = async () => {
    const crimes = await getCrimes(setLoadingMenu);
    if (crimes) {
      setCrimes(crimes);
      if (windowWidth >= 1200) {
        setCrimeSelected(crimes[0].category);
        loadCrimeDataNeighborhoods(crimes[0].category);
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
        if (!showViewStatistics) setShowViewStatistics(true);

        handleClose();
        setCrimeSelected();
        loadDataQuizes();
        setShowQuizes(true);
      }
    } else if (!showViewStatistics) setShowViewStatistics(true);
  };

  return (
    <>
      {loadingMenu == true && (
        <AlertMenu
          title={"Espere un momento"}
          msj={"Cargando opciones"}
          doneOption={null}
        />
      )}
      {loadingMenu == false && !crimes && closeAlert && (
        <AlertMenu
          title={"Ups,algo salio mal"}
          msj={"No se pudieron cargar las opciones"}
          doneOption={true}
          setCloseAlert={setCloseAlert}
        />
      )}

      <ul className={styles.menuOptionsCrimes}>
        {loadingMenu == false && crimes && (
          <>
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
          </>
        )}
      </ul>
    </>
  );
};
