import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export const MapHandler = ({ place, marker }) => {
  const map = useMap();

  useEffect(() => {
    if (!place) {
      marker.position = null;
      return;
    }

    if (place.viewport) {
      map.setZoom(15);
      map.panTo({
        lat: place.location.latitude,
        lng: place.location.longitude
      });
    }
    marker.position = {
      lat: place.location.latitude,
      lng: place.location.longitude
    };
  }, [map, place, marker]);
  return null;
};
