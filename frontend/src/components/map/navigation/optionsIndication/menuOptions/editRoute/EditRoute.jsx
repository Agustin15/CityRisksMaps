import styles from "../MenuOptions.module.css";
import iconEditRoute from "../../../../../../assets/img/editRoute.png";
import iconDeleteIntermediates from "../../../../../../assets/img/deleteChangesRoute.png";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../../../../../../contexts/navigationContext/NavigationContext";
import { useNavigationStep } from "../../../../../../contexts/navigationContext/NavigationStepContext";
import { useNeighborhoodsCrimes } from "../../../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useRoutes } from "../../../../../../contexts/routesContext/RoutesContext";
import { createIntermediates } from "./functions";

export const EditRoute = () => {
  const [intermediates, setIntermediates] = useState([]);
  const { recalculateRoute, routeNavigation } = useNavigation();
  const { destinationLocation } = useRoutes();
  const { warning } = useNavigationStep();
  const { polygons } = useNeighborhoodsCrimes();

  let refIntermediates = useRef();

  useEffect(() => {
    refIntermediates.current = intermediates;
    if (intermediates.length == 0) return;

    recalculateRoute(intermediates);
  }, [intermediates]);

  const handleCreateIntermediates = () => {
    const coordinatesOutsidePolygonDanger = createIntermediates(
      polygons,
      routeNavigation,
      destinationLocation,
      warning
    );

    if (
      coordinatesOutsidePolygonDanger &&
      coordinatesOutsidePolygonDanger.length > 0
    ) {
      setIntermediates(coordinatesOutsidePolygonDanger);
    }
  };

  return (
    <>
      <div className={styles.containBtn}>
        <button
          onClick={() => handleCreateIntermediates()}
          className={styles.btnEditRoute}
        >
          <img src={iconEditRoute}></img>
        </button>
      </div>
      {intermediates.length > 0 && (
        <div className={styles.containBtn}>
          <button
            onClick={() => {
              setIntermediates([]);
              recalculateRoute([]);
            }}
            title="Volver a ruta original"
          >
            <img src={iconDeleteIntermediates}></img>
          </button>
        </div>
      )}
    </>
  );
};
