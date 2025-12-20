import styles from "./PlaceDetails.module.css";
import iconAddress from "../../../assets/img/address.png";
import iconPhone from "../../../assets/img/phone.png";
import iconWeb from "../../../assets/img/web.png";
import { OpeningDays } from "./openingDays/OpeningDays";
import { About } from "./about/About.jsx";
import { ContainPhoto } from "./containPhoto/ContainPhoto";
import { BtnIndications } from "../BtnIndications/BtnIndications";

export const PlaceDetails = ({ place }) => {
  return (
    <div className={styles.containDetails}>
      <div className={styles.header}>
        <ContainPhoto place={place} />

        <h3>{place.displayName.text}</h3>
        {place.rating || place.primaryTypeDisplayName ? (
          <About place={place} />
        ) : (
          <div className={styles.row}>
            <span>{place.addressComponents[1].longText}</span>

            <BtnIndications place={place}></BtnIndications>
          </div>
        )}
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
        {place.regularOpeningHours && <OpeningDays place={place} />}

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
