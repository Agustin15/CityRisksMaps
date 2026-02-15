import styles from "./viewPlaces.module.css";
import iconMap from "../../../../assets/img/map.png";
import { Activity, useEffect, useId } from "react";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { useSearchPlace } from "../../../../contexts/SearchPlaceContext";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";
import { MenuRoute } from "../../menuRoute/MenuRoute";
import { PlaceDetails } from "../../placeDetails/PlaceDetails.jsx";
import { PlacesSearched } from "../../placesSearched/PlacesSearched";

export const ViewPlaces = () => {
  const { showMenuRoutes } = useRoutes();
  const { selectedPlace, placesSearched } = useSearchPlace();
  const viewPlacesId = useId();
  const { windowWidth } = useWindowResize();

  useEffect(() => {
    if (document.getElementById(viewPlacesId)) {
      document
        .getElementById(viewPlacesId)
        .getAnimations()
        .map((animation) => animation.cancel());
    }
  }, [windowWidth]);

  return (
    <div id={viewPlacesId} className={styles.viewPlaces}>
      {selectedPlace && showMenuRoutes == false && (
        <PlaceDetails place={selectedPlace} />
      )}

      {placesSearched && (
        <Activity mode={selectedPlace ? "hidden" : "display"}>
          <PlacesSearched />
        </Activity>
      )}

      {!showMenuRoutes && !placesSearched && !selectedPlace && (
        <div className={styles.placeNotSelected}>
          <img src={iconMap}></img>
          <h3>No se selecciono ningun lugar aun</h3>
        </div>
      )}

      {showMenuRoutes && <MenuRoute />}
    </div>
  );
};
