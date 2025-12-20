import styles from "./OptionsAddress.module.css";
import iconMyLocation from "../../../../assets/img/useMyLocation.png";
import iconAddress from "../../../../assets/img/destinyAddress.png";
import { useMapControls } from "../../../../contexts/MapContext";
import { useRoutes } from "../../../../contexts/RoutesContext";

export const OptionsAddress = ({ suggestions, lastInputChanged }) => {
  const { userLocation } = useMapControls();
  const { setOrigin, setDestiny } = useRoutes();

  const handleClick = (address) => {
    if (lastInputChanged == "origin") setOrigin(address);
    else setDestiny(address);
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
            onClick={() => handleClick(suggestion.placePrediction.text.text)}
            key={index}
          >
            <img src={iconAddress}></img>
            <p>{suggestion.placePrediction.text.text}</p>
          </li>
        ))}
    </ul>
  );
};
