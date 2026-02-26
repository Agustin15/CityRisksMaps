import styles from "./StreetView.module.css";
import rotation from "../../../../assets/img/rotation.png";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchPlace } from "../../../../contexts/SearchPlaceContext";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";
import { FullScreen } from "./fullScreen/FullScreen";
import { Modal } from "../../modal/Modal";

export const StreetView = () => {
  const panoRef = useRef();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { getStreetViewStaticImage, imageStreet } = usePhotosPlace();
  const { selectedPlace } = useSearchPlace();

  useEffect(() => {
    if (!selectedPlace) return;

    getStreetViewStaticImage(
      200,
      200,
      selectedPlace.location.latitude,
      selectedPlace.location.longitude
    );
  }, [selectedPlace]);

  return (
    imageStreet && (
      <>
        <div
          ref={panoRef}
          style={{ backgroundImage: `url(${imageStreet})` }}
          className={styles.streetView}
        >
          <img onClick={() => setIsFullScreen(true)} src={rotation}></img>
        </div>

        {isFullScreen &&
          createPortal(
            <Modal>
              <FullScreen
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
              />
            </Modal>,
            document.body
          )}
      </>
    )
  );
};
