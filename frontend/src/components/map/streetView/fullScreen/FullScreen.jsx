import { useEffect, useRef } from "react";
import styles from "./FullScreen.module.css";
import { useSearchPlace } from "../../../../contexts/SearchPlaceContext";

export const FullScreen = ({ isFullScreen, setIsFullScreen }) => {
  const fullScreenRef = useRef();
  const { selectedPlace, streetViewSelected } = useSearchPlace();

  useEffect(() => {
    if (
      !isFullScreen ||
      !fullScreenRef.current ||
      (!selectedPlace && !streetViewSelected)
    )
      return;

    new google.maps.StreetViewPanorama(fullScreenRef.current, {
      position: {
        lat: selectedPlace
          ? selectedPlace.location.latitude
          : streetViewSelected[0].geometry.location.lat(),
        lng: selectedPlace
          ? selectedPlace.location.longitude
          : streetViewSelected[0].geometry.location.lng()
      },
      fullscreenControl: false,
      pov: { heading: 165, pitch: 0 },
      zoom: 1
    });
  }, [isFullScreen, selectedPlace, streetViewSelected]);

  const handleClose = () => {
    setIsFullScreen(false);
  };

  return (
    <div ref={fullScreenRef} className={styles.fullScreen}>
      <button onClick={handleClose} className={styles.closeButton}>
        X
      </button>
    </div>
  );
};
