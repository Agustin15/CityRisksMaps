import styles from "./StreetSelected.module.css";
import { useEffect, useRef } from "react";
import { useSearchPlace } from "../../../contexts/searchPlaceContext/SearchPlaceContext";
import { InfoStreet } from "./infoStreet/InfoStreet";
import { findComponentAddress } from "./functions";

export const StreetSelected = () => {
  const { streetSelected } = useSearchPlace();
  const streetViewRef = useRef();

  const { lat, lng } = streetSelected[0].geometry.location;

  let administrativeArea = findComponentAddress(
    ["administrative_area_level_1"],
    streetSelected
  );

  useEffect(() => {
    if (!streetSelected || !streetViewRef.current) return;

    new google.maps.StreetViewPanorama(streetViewRef.current, {
      position: { lat: lat(), lng: lng() },
      pov: {
        heading: 34,
        pitch: 10
      },
      panControl: false
    });
  }, [streetSelected, streetViewRef]);

  return (
    <div className={styles.containStreetSelected}>
      <div className={styles.locationInfo}>
        <div className={styles.title}>
          <div className={styles.territory}></div>
          {administrativeArea.long_name}
        </div>

        <InfoStreet streetSelected={streetSelected} lat={lat} lng={lng} />
      </div>
      
      <div className={styles.containStreetView}>
        <div className={styles.streetView} ref={streetViewRef}></div>
      </div>
    </div>
  );
};
