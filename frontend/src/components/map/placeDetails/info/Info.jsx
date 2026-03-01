import styles from "./Info.module.css";
import { useSearchPlace } from "../../../../contexts/searchPlaceContext/SearchPlaceContext";
import { OpeningDays } from "../openingDays/OpeningDays";

export const Info = () => {
  const { selectedPlace } = useSearchPlace();

  return (
    <ul className={styles.info}>
      {selectedPlace.formattedAddress && (
        <li>
          <div className={styles.address}></div>
          <p>{selectedPlace.formattedAddress}</p>
        </li>
      )}
      {selectedPlace.regularOpeningHours && (
        <OpeningDays place={selectedPlace} />
      )}

      {selectedPlace.nationalPhoneNumber && (
        <li>
          <div className={styles.phone}></div>

          {selectedPlace.nationalPhoneNumber}
        </li>
      )}
      {selectedPlace.websiteUri && (
        <li>
          <div className={styles.web}></div>
          <a href={selectedPlace.websiteUri}>
            {new URL(selectedPlace.websiteUri).hostname}
          </a>
        </li>
      )}
    </ul>
  );
};
