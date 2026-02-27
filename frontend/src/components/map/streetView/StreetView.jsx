import styles from "./StreetView.module.css";
import rotation from "../../../assets/img/rotation.png";
import { useEffect, useState } from "react";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { usePhotosPlace } from "../../../contexts/PhotosContext";
import { createPortal } from "react-dom";
import { FullScreen } from "./fullScreen/FullScreen";
import { Modal } from "../modal/Modal";

export const StreetView = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { getStreetViewStaticImage, imageStreet } = usePhotosPlace();
  const { selectedPlace, streetSelected } = useSearchPlace();

  useEffect(() => {
    if (!selectedPlace && !streetSelected) return;

    let latLng = selectedPlace
      ? {
          lat: selectedPlace.location.latitude,
          lng: selectedPlace.location.longitude
        }
      : {
          lat: streetSelected[0].geometry.location.lat(),
          lng: streetSelected[0].geometry.location.lng()
        };

    getStreetViewStaticImage(200, 200, latLng.lat, latLng.lng);
  }, [selectedPlace, streetSelected]);

  return (
    imageStreet && (
      <>
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
      </>
    )
  );
};
