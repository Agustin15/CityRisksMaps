import styles from "./Menu.module.css";
import { useState, useEffect } from "react";
import { useNeighborhoodsCrimes } from "../../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useWindowResize } from "../../../../../contexts/WindowResizeContext.jsx";
import { Item } from "./item/Item.jsx";
import { AlertMenu } from "./AlertMenu/alertMenu.jsx";
import { getCrimes } from "../functions.js";

export const Menu = ({
  neighbordhoodsCoordinates,
  showViewStatistics,
  setShowViewStatistics
}) => {
  const [crimes, setCrimes] = useState();
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [errorLoad, setErrorLoad] = useState();
  const [closeAlert, setCloseAlert] = useState(true);

  const { windowWidth } = useWindowResize();
  const { setCrimeSelected, loadCrimeDataNeighborhoods } =
    useNeighborhoodsCrimes();

  useEffect(() => {
    if (!neighbordhoodsCoordinates) return;
    loadData();
  }, [neighbordhoodsCoordinates]);

  const loadData = async () => {
    const crimes = await getCrimes(loadingMenu, setLoadingMenu, setErrorLoad);
    if (crimes) {
      setCrimes(crimes);
      if (windowWidth >= 1200) {
        setCrimeSelected(crimes[0].category);
        loadCrimeDataNeighborhoods(crimes[0].category);
      }
    }
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
          msj={errorLoad}
          doneOption={true}
          setCloseAlert={setCloseAlert}
          setErrorLoad={setErrorLoad}
        />
      )}

      <ul className={styles.menuOptionsCrimes}>
        {loadingMenu == false &&
          crimes &&
          crimes.map((crime, index) => (
            <Item
              key={index}
              crime={crime}
              setShowViewStatistics={setShowViewStatistics}
              showViewStatistics={showViewStatistics}
            />
          ))}
      </ul>
    </>
  );
};
