import styles from "./viewPlaces.module.css";
import iconMap from "../../../../assets/img/map.png";
import { Activity, useId } from "react";
import { useSearchPlace } from "../../../../contexts/searchPlaceContext/SearchPlaceContext";
import { PlaceDetails } from "../../placeDetails/PlaceDetails.jsx";
import { PlacesSearched } from "../../placesSearched/PlacesSearched";
import { StreetSelected } from "../../streetSelected/StreetSelected.jsx";

export const ViewPlaces = () => {
  const { selectedPlace, placesSearched, streetSelected } = useSearchPlace();
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

      {selectedPlace && <PlaceDetails />}
      {streetSelected && <StreetSelected />}

      {placesSearched && (
        <Activity mode={selectedPlace ? "hidden" : "display"}>
          <PlacesSearched />
        </Activity>
      )}

    </div>
  );
};
