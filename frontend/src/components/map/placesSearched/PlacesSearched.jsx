import { PhotosProvider } from "../../../contexts/PhotosContext";
import { Photo } from "./photo/Photo";
import styles from "./PlacesSearched.module.css";
import { Rating } from "./rating/Rating";
import { StateOpen } from "./stateOpen/StateOpen";

export const PlacesSearched = ({ setSelectedPlace, places }) => {
  const handleClick = (place) => {
    setSelectedPlace(place);
  };
  return (
    <div className={styles.containPlaces}>
      <h4>Resultados:</h4>
      <ul>
        {places.map((place, index) => (
          <li onClick={() => handleClick(place)} key={index}>
            <div className={styles.row}>
              <div className={styles.details}>
                <h4>{place.displayName.text}</h4>
                <Rating place={place} />
                <p>{place.shortFormattedAddress}</p>

                <StateOpen place={place} />
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
