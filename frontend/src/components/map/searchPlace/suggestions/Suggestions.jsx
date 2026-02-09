import iconAddress from "../../../../assets/img/destinationAddress.png";
import styles from "./Suggestions.module.css";

export const Suggestions = ({ suggestions, moreDetailsPlace }) => {
  return (
    <ul className={styles.suggestions}>
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() =>
            moreDetailsPlace(suggestion.placePrediction.placeId, true)
          }
        >
          <img src={iconAddress}></img>
          <p>{suggestion.placePrediction.text.text}</p>
        </li>
      ))}
    </ul>
  );
};
