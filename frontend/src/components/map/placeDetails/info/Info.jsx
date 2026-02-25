import styles from "./Info.module.css";
import iconAddress from "../../../../assets/img/address.png";
import iconPhone from "../../../../assets/img/phone.png";
import iconWeb from "../../../../assets/img/web.png";
import { useSearchPlace } from "../../../../contexts/SearchPlaceContext";
import { OpeningDays } from "../openingDays/OpeningDays";

export const Info = () => {
  const { selectedPlace } = useSearchPlace();

  return (
    <ul className={styles.info}>
      {selectedPlace.formattedAddress && (
        <li>
          <div className={styles.boxIcon}>
            <img src={iconAddress}></img>
          </div>
          <p>{selectedPlace.formattedAddress}</p>
        </li>
      )}
      {selectedPlace.regularOpeningHours && (
        <OpeningDays place={selectedPlace} />
      )}

      {selectedPlace.nationalPhoneNumber && (
        <li>
          <div className={styles.boxIcon}>
            <img src={iconPhone}></img>
          </div>
          {selectedPlace.nationalPhoneNumber}
        </li>
      )}
      {selectedPlace.websiteUri && (
        <li>
          <div className={styles.boxIcon}>
            <img src={iconWeb}></img>
          </div>
          <a href={selectedPlace.websiteUri}>
            {new URL(selectedPlace.websiteUri).hostname}
          </a>
        </li>
      )}
    </ul>
  );
};
