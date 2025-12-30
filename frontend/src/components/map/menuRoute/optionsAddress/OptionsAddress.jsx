import styles from "./OptionsAddress.module.css";
import iconMyLocation from "../../../../assets/img/useMyLocation.png";
import iconAddress from "../../../../assets/img/destinyAddress.png";
import { useMapControls } from "../../../../contexts/MapContext";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";

export const OptionsAddress = ({ suggestions, setSuggestions }) => {
  const { userLocation } = useMapControls();
  const { setOrigin, setOriginLocation } = useRoutes();

  const handleClick = (address, location) => {
    setOrigin(address);
    setOriginLocation(location);
    setSuggestions();
  };
  return (
    <ul className={styles.optionsAddress}>
      {userLocation && (
        <li>
          <div className={styles.icon}>
            <img src={iconMyLocation}></img>
          </div>
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
