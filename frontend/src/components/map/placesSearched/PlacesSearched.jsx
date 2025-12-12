import styles from "./PlacesSearched.module.css";
import { PhotosProvider } from "../../../contexts/PhotosContext";
import { Photo } from "./photo/Photo";
import { Rating } from "./rating/Rating";
import { StateOpen } from "./stateOpen/StateOpen";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";

export const PlacesSearched = () => {
  const { setSelectedPlace, placesSearched, setValueInput } = useSearchPlace();

  const handleClick = (place) => {
    setSelectedPlace(place);
    setValueInput(place.displayName.text);
  };
  return (
    <div className={styles.containPlaces}>
      <h4>Resultados:</h4>
      <ul>
        {placesSearched.map((place, index) => (
          <li onClick={() => handleClick(place)} key={index}>
            <div className={styles.row}>
              <div className={styles.details}>
                <h4>{place.displayName.text}</h4>
                <Rating place={place} />
                <p>{place.shortFormattedAddress}</p>

                {place.regularOpeningHours && <StateOpen place={place} />}
              </div>
              <PhotosProvider>
                <Photo photo={place.photos[0]} />
              </PhotosProvider>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
