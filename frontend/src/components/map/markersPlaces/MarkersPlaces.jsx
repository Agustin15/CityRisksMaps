import styles from "./MarkersPlaces.module.css";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";

export const MarkersPlaces = ({ placesSearched }) => {
  const { setSelectedPlace } = useSearchPlace();

  return placesSearched.map((place, index) => (
    <AdvancedMarker
      onClick={() => setSelectedPlace(place)}
      key={index}
      position={{ lat: place.location.latitude, lng: place.location.longitude }}
    >
      <div className={styles.marker}>
        <div
          style={{ background: place.iconBackgroundColor }}
          className={styles.background}
        >
          <img src={place.iconMaskBaseUri + ".png"}></img>
        </div>
      </div>
    </AdvancedMarker>
  ));
};
