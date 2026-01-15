import styles from "./OptionsAddress.module.css";
import iconMyLocation from "../../../../assets/img/useMyLocation.png";
import iconAddress from "../../../../assets/img/destinyAddress.png";
import { useMapControls } from "../../../../contexts/MapContext";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";

export const OptionsAddress = ({ suggestions, setSuggestions }) => {
  const { userLocation } = useMapControls();
  const { setOrigin, setOriginLocation, routes } = useRoutes();

  const handleClick = (address, location) => {
    setOrigin(address);
    setOriginLocation(location);
    setSuggestions();
  };
  return (
    <ul className={styles.optionsAddress}>
      {userLocation && !routes && (
        <li
          onClick={() =>
            handleClick("Mi ubicacion", {
              latitude: userLocation.lat,
              longitude: userLocation.lng
            })
          }
        >
          <img src={iconMyLocation}></img>
          Mi ubicacion
        </li>
      )}
      {suggestions &&
        suggestions.map((suggestion, index) => (
          <li
            onClick={() =>
              handleClick(suggestion.formattedAddress, suggestion.location)
            }
            key={index}
          >
            <img src={iconAddress}></img>
            <p>
              <span className={styles.displayName}>
                {suggestion.displayName.text},
              </span>
              <span className={styles.formattedAddress}>
                {suggestion.formattedAddress}
              </span>
            </p>
          </li>
        ))}
    </ul>
  );
};
