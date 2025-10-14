import styles from "./PlaceDetails.module.css";
import iconAddress from "../../../assets/img/address.png";
import iconPhone from "../../../assets/img/phone.png";
import iconWeb from "../../../assets/img/web.png";
import { OpeningDays } from "./openingDays/OpeningDays";
import { Rating } from "./rating/Rating";
import { ContainPhoto } from "./containPhoto/ContainPhoto";

export const PlaceDetails = ({ place }) => {
  const getDay = (weekday) => {
    const days = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo"
    ];

    return days.find((day, index) => index + 1 == weekday);
  };

  return (
    <div className={styles.containDetails}>
      <div className={styles.header}>
        <ContainPhoto place={place} />
        <h3>{place.displayName.text}</h3>
        {place.rating && <Rating place={place} />}
      </div>

      {place.editorialSummary && (
        <div className={styles.aboutIt}>
          <h4>Datos básicos</h4>
          <p>{place.editorialSummary.text}</p>
        </div>
      )}
      <ul className={styles.info}>
        {place.formattedAddress && (
          <li>
            <div className={styles.boxIcon} style={{ background: "red" }}>
              <img src={iconAddress}></img>
            </div>
            <p>{place.formattedAddress}</p>
          </li>
        )}
        {place.regularOpeningHours && (
          <OpeningDays getDay={getDay} place={place} />
        )}

        {place.nationalPhoneNumber && (
          <li>
            <div className={styles.boxIcon} style={{ background: "#1fcaa5ff" }}>
              <img src={iconPhone}></img>
            </div>
            {place.nationalPhoneNumber}
          </li>
        )}
        {place.websiteUri && (
          <li>
            <div className={styles.boxIcon}>
              <img src={iconWeb}></img>
            </div>
            <a href={place.websiteUri}>{new URL(place.websiteUri).hostname}</a>
          </li>
        )}
      </ul>
    </div>
  );
};
