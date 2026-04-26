import styles from "./Suggestions.module.css";
import iconAddress from "../../../../assets/img/destinationAddress.png";
import { useSearchPlace } from "../../../../contexts/searchPlaceContext/SearchPlaceContext";

export const Suggestions = ({ suggestions }) => {
  const { handleClickOnSuggestionAddress } = useSearchPlace();
  return (
    <ul className={styles.suggestions}>
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() =>
            handleClickOnSuggestionAddress(suggestion.placePrediction.text.text)
          }
        >
          <img src={iconAddress}></img>
          <p>{suggestion.placePrediction.text.text}</p>
        </li>
      ))}
    </ul>
  );
};
