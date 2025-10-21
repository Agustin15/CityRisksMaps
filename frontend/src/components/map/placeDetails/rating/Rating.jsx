import ceroStars from "../../../../assets/img/ceroStars.png";
import halfStar from "../../../../assets/img/halfStar.png";
import oneStar from "../../../../assets/img/oneStar.png";
import oneHalfStar from "../../../../assets/img/oneHalfStar.png";
import twoStars from "../../../../assets/img/twoStars.png";
import twoHalfStars from "../../../../assets/img/twoHalfStars.png";
import threeStars from "../../../../assets/img/threeStars.png";
import threeHalfStars from "../../../../assets/img/threeHalfStars.png";
import fourStars from "../../../../assets/img/fourStars.png";
import fourHalfStars from "../../../../assets/img/fourHalfStars.png";
import fiveStars from "../../../../assets/img/fiveStars.png";
import iconWheelchair from "../../../../assets/img/wheelchair.png";
import { BtnIndications } from "../../BtnIndications/BtnIndications";
import styles from "./Rating.module.css";

export const Rating = ({ place }) => {
  const getStarsRating = (rating) => {
    const ratingStars = [
      { rating: { min: 0.0, maz: 0.4 }, stars: ceroStars },
      { rating: { min: 0.5, max: 0.9 }, stars: halfStar },
      { rating: { min: 1.0, max: 1.4 }, stars: oneStar },
      { rating: { min: 1.5, max: 1.9 }, stars: oneHalfStar },
      { rating: { min: 2.0, max: 2.4 }, stars: twoStars },
      { rating: { min: 2.5, max: 2.9 }, stars: twoHalfStars },
      { rating: { min: 3.0, max: 3.4 }, stars: threeStars },
      { rating: { min: 3.5, max: 3.9 }, stars: threeHalfStars },
      { rating: { min: 4.0, max: 4.4 }, stars: fourStars },
      { rating: { min: 4.5, max: 4.9 }, stars: fourHalfStars },
      { rating: { min: 5.0, max: 5.0 }, stars: fiveStars }
    ];

    const ratingStar = ratingStars.find(
      (ratingStar) =>
        rating >= ratingStar.rating.min && rating <= ratingStar.rating.max
    );

    return ratingStar.stars;
  };

  return (
    <div className={styles.rating}>
      <div className={styles.row}>
        <span>{place.rating}</span>
        <img className={styles.stars} src={getStarsRating(place.rating)}></img>
        <span>({place.userRatingCount})</span>
      </div>
      <div className={styles.rowTwo}>
        <div className={styles.data}>
          {place.primaryTypeDisplayName && (
            <span>{place.primaryTypeDisplayName.text}</span>
          )}
          {place.accessibilityOptions &&
            place.accessibilityOptions.wheelchairAccessibleEntrance && (
              <img className={styles.wheelchair}
                title="Entrada accesible para gente en silla de ruedas"
                src={iconWheelchair}
              ></img>
            )}
        </div>

        <BtnIndications />
      </div>
    </div>
  );
};
