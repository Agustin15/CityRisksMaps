import { useEffect, useRef } from "react";
import styles from "./FullScreen.module.css";
import { useSearchPlace } from "../../../../../contexts/SearchPlaceContext";

export const FullScreen = ({ isFullScreen, setIsFullScreen }) => {
  const fullScreenRef = useRef();
  const { selectedPlace } = useSearchPlace();

  useEffect(() => {
    if (!isFullScreen || !fullScreenRef.current || !selectedPlace) return;

    new google.maps.StreetViewPanorama(fullScreenRef.current, {
      position: {
        lat: selectedPlace.location.latitude,
        lng: selectedPlace.location.longitude
      },
      fullscreenControl: false,
      pov: { heading: 165, pitch: 0 },
      zoom: 1
    });
  }, [isFullScreen, selectedPlace]);

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
