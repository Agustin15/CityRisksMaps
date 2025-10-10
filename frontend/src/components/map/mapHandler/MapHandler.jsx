import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { useMapControls } from "../../../contexts/MapContext";

export const MapHandler = ({ place, marker }) => {
  const map = useMap();
  const { createDetailsPlace } = useMapControls();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }

    marker.position = place.geometry?.location;
  }, [map, place, marker]);
  return null;
};
