import styles from "./PlaceDetails.module.css";
import iconAddress from "../../../assets/img/address.png";
import iconPhone from "../../../assets/img/phone.png";
import iconWeb from "../../../assets/img/web.png";
import iconMap from "../../../assets/img/map.png";
import { OpeningDays } from "./openingDays/OpeningDays";
import { About } from "./about/About.jsx";
import { ContainPhoto } from "./containPhoto/ContainPhoto";
import { BtnIndications } from "../BtnIndications/BtnIndications";

export const PlaceDetails = ({ place }) => {
  return (
    <div className={styles.containDetails}>
      {place ? (
        <>
          <ContainPhoto place={place} />

          <div className={styles.column}>
            <h3 className={styles.title}>{place.displayName.text}</h3>

            {place.rating || place.primaryTypeDisplayName ? (
              <About place={place} />
            ) : (
              <div className={styles.row}>
                <span>{place.addressComponents[1].longText}</span>

                <BtnIndications place={place}></BtnIndications>
              </div>
            )}

            {place.editorialSummary && (
              <div className={styles.aboutIt}>
                <span>Datos básicos</span>
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
                  <div
                    className={styles.boxIcon}
                    style={{ background: "#1fcaa5ff" }}
                  >
                    <img src={iconPhone}></img>
                  </div>
                  {place.nationalPhoneNumber}
                </li>
              )}
              {place.websiteUri && (
                <li>
                  <div
                    className={styles.boxIcon}
                    style={{ background: "#278e9bff" }}
                  >
                    <img src={iconWeb}></img>
                  </div>
                  <a href={place.websiteUri}>
                    {new URL(place.websiteUri).hostname}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div className={styles.placeNotSelected}>
          <img src={iconMap}></img>
          <h3>No se selecciono ningun lugar aun</h3>
        </div>
      )}
    </div>
  );
};
