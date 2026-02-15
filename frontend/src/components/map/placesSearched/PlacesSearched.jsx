import styles from "./PlacesSearched.module.css";
import { PhotosProvider } from "../../../contexts/PhotosContext";
import { Photo } from "./photo/Photo";
import { Rating } from "./rating/Rating";
import { StateOpen } from "./stateOpen/StateOpen";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { useMap } from "@vis.gl/react-google-maps";
import { useId } from "react";
import { resize } from "../optionsMap/viewStatistics/functions.js";

export const PlacesSearched = () => {
  const { setSelectedPlace, placesSearched, setValueInput, valueInput } =
    useSearchPlace();

  const map = useMap();
  const placesId = useId();

  const handleClick = (place) => {
    setSelectedPlace(place);
    setValueInput(place.displayName.text);
    map.setZoom(15);
    map.panTo({ lat: place.location.latitude, lng: place.location.longitude });
  };

  return (
    <div id={placesId} className={styles.containPlaces}>
      <div onClick={(event) => resize(event)} className={styles.deploy}></div>

      <h4>Resultados a la busqueda {valueInput}:</h4>
      <ul>
        {placesSearched.map((place, index) => (
          <li onClick={() => handleClick(place)} key={index}>
            <div className={styles.row}>
              <div className={styles.details}>
                <h4>{place.displayName.text}</h4>
                {place.rating && <Rating place={place} />}
                <p>{place.shortFormattedAddress}</p>

                {place.regularOpeningHours && <StateOpen place={place} />}
              </div>
              <PhotosProvider>
                <Photo place={place} />
              </PhotosProvider>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
