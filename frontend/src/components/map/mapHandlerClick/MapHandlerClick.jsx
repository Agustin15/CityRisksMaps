import {
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useMap
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { StreetView } from "../streetView/StreetView";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";
import { useNavigation } from "../../../contexts/NavigationContext";

export const MapHandlerClick = () => {
  const map = useMap();
  const { selectedPlace, streetSelected } = useSearchPlace();
  const { routeNavigation } = useNavigation();

  useEffect(() => {
    if (!selectedPlace && !streetSelected) return;

    if (selectedPlace || streetSelected) {
      map.setZoom(15);
      map.panTo(
        selectedPlace
          ? {
              lat: selectedPlace.location.latitude,
              lng: selectedPlace.location.longitude
            }
          : streetSelected[0].geometry.location
      );
    }
  }, [map, selectedPlace, streetSelected]);

  return (
    <>
      <AdvancedMarker
        position={
          selectedPlace
            ? {
                lat: selectedPlace.location.latitude,
                lng: selectedPlace.location.longitude
              }
            : streetSelected[0].geometry.location
        }
      ></AdvancedMarker>

      {selectedPlace && !routeNavigation && (
        <MapControl position={ControlPosition.LEFT_BOTTOM}>
          <StreetView />
        </MapControl>
      )}
    </>
  );
};
