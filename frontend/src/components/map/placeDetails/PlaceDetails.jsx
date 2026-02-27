import { useEffect, useRef } from "react";
import styles from "./PlaceDetails.module.css";
import { usePhotosPlace } from "../../../contexts/PhotosContext.jsx";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext.jsx";
import { About } from "./about/About.jsx";
import { ContainPhoto } from "./containPhoto/ContainPhoto";
import { BtnIndications } from "../BtnIndications/BtnIndications";
import { Info } from "./info/Info.jsx";
import { useWindowResize } from "../../../contexts/WindowResizeContext.jsx";

export const PlaceDetails = () => {
  const { selectedPlace } = useSearchPlace();
  const { photosList } = usePhotosPlace();
  const { windowWidth } = useWindowResize();

  return (
    <div className={styles.containDetails}>
      {photosList && windowWidth >= 1200 && <ContainPhoto />}

      <div className={styles.column}>
        <h3 className={styles.title}>{selectedPlace.displayName.text}</h3>

        {selectedPlace.rating || selectedPlace.primaryTypeDisplayName ? (
          <About place={selectedPlace} />
        ) : (
          <div className={styles.row}>
            <span>{selectedPlace.addressComponents[1].longText}</span>

            <BtnIndications place={selectedPlace}></BtnIndications>
          </div>
        )}

        {photosList && windowWidth < 1200 && <ContainPhoto />}

        {selectedPlace.editorialSummary && (
          <div className={styles.description}>
            <span>Datos básicos</span>
            <p>{selectedPlace.editorialSummary.text}</p>
          </div>
        )}

        <Info />
      </div>
    </div>
  );
};
