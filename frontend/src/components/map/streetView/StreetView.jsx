import styles from "./StreetView.module.css";
import rotation from "../../../assets/img/rotation.png";
import { useEffect, useState } from "react";
import { useSearchPlace } from "../../../contexts/searchPlaceContext/SearchPlaceContext";
import { usePhotosPlace } from "../../../contexts/PhotosContext";
import { createPortal } from "react-dom";
import { FullScreen } from "./fullScreen/FullScreen";
import { Modal } from "../modal/Modal";

export const StreetView = () => {
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
      <div>
        <div
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
      </div>
    )
  );
};
