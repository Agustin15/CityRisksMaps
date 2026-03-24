import styles from "../MenuOptions.module.css";
import iconEditRoute from "../../../../../../assets/img/editRoute.png";
import iconDeleteIntermediates from "../../../../../../assets/img/deleteChangesRoute.png";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../../../../../../contexts/navigationContext/NavigationContext";
import { useMap } from "@vis.gl/react-google-maps";
import { alertSwalError } from "../../../../../sweetAlert/sweetAlert";

export const EditRoute = () => {
  const { recalculateRoute, editRoute, setEditRoute } = useNavigation();
  const [intermediates, setIntermediates] = useState([]);
  let refIntermediates = useRef();
  const map = useMap();

  useEffect(() => {
    refIntermediates.current = intermediates;
    if (intermediates.length == 0) return;

    recalculateRoute(intermediates);
  }, [intermediates]);

  const handleCreateIntermediates = () => {
    if (editRoute) {
      setEditRoute(false);
      google.maps.event.clearListeners(map, "click");
      map.setOptions({ draggableCursor: "auto" });
      return;
    }

    setEditRoute(true);
    map.setOptions({ draggableCursor: "crosshair" });
    map.addListener("click", (event) => {
      if (refIntermediates.length == 10)
        return alertSwalError(
          "Ups,hubo un error al agregar el nuevo desvio",
          "No se permiten mas de 10 puntos de desvio en la ruta"
        );

      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();

      const location = {
        location: {
          latLng: {
            latitude: latitude,
            longitude: longitude
          }
        }
      };
      setIntermediates([...refIntermediates.current, location]);
    });
  };

  return (
    <>
      <button
        onClick={() => handleCreateIntermediates()}
        className={!editRoute ? styles.btnEditRoute : styles.btnEditRouteActive}
        title="Agregar desvio"
      >
        <img src={iconEditRoute}></img>
      </button>
      {intermediates.length > 0 && (
        <button
          onClick={() => {
            setIntermediates([]);
            recalculateRoute([]);
          }}
          title="Volver a ruta original"
        >
          <img src={iconDeleteIntermediates}></img>
        </button>
      )}
    </>
  );
};
