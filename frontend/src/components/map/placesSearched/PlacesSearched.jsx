import styles from "./PlacesSearched.module.css";
import { PhotosProvider } from "../../../contexts/PhotosContext";
import { Photo } from "./photo/Photo";
import { Rating } from "./rating/Rating";
import { StateOpen } from "./stateOpen/StateOpen";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { useMap } from "@vis.gl/react-google-maps";

export const PlacesSearched = () => {
  const { setSelectedPlace, placesSearched, setValueInput, valueInput } =
    useSearchPlace();
  const map = useMap();

  const handleClick = (place) => {
    setSelectedPlace(place);
    setValueInput(place.displayName.text);
    map.setZoom(15);
    map.panTo({ lat: place.location.latitude, lng: place.location.longitude });
  };
  return (
    <div className={styles.containPlaces}>
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
                {place.photos && <Photo photo={place.photos[0]} />}
              </PhotosProvider>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
