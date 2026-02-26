import styles from "./viewPlaces.module.css";
import iconMap from "../../../../assets/img/map.png";
import { Activity,  useId } from "react";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { useSearchPlace } from "../../../../contexts/SearchPlaceContext";
import { MenuRoute } from "../../menuRoute/MenuRoute";
import { PlaceDetails } from "../../placeDetails/PlaceDetails.jsx";
import { PlacesSearched } from "../../placesSearched/PlacesSearched";

export const ViewPlaces = () => {
  const { showMenuRoutes } = useRoutes();
  const { selectedPlace, placesSearched } = useSearchPlace();
  const viewPlacesId = useId();

  return (
    <div id={viewPlacesId} className={styles.viewPlaces}>
      <div className={styles.containCheckDeploy}>
        <label htmlFor="checkDeployPlaces"></label>
        <input
          type="checkbox"
          id="checkDeployPlaces"
          className={styles.deploy}
        />
      </div>

      {selectedPlace && showMenuRoutes == false && <PlaceDetails />}

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
