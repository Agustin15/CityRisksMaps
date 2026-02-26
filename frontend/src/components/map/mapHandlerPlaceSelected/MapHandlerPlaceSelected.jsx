import { ControlPosition, MapControl, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { useNavigation } from "../../../contexts/NavigationContext";
import { StreetView } from "../placeDetails/streetView/StreetView";

export const MapHandlerPlaceSelected = ({ place, marker }) => {
  const map = useMap();
  const { routeNavigation } = useNavigation();

  useEffect(() => {
    if (!marker) return;

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

  return (
    place &&
    !routeNavigation && (
      <MapControl position={ControlPosition.LEFT_BOTTOM}>
        <StreetView />
      </MapControl>
    )
  );
};
