import {
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useMap
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { useSearchPlace } from "../../../contexts/searchPlaceContext/SearchPlaceContext";
import { useNavigation } from "../../../contexts/navigationContext/NavigationContext";
import { StreetView } from "../streetView/StreetView";

export const MapHandlerClick = () => {
  const map = useMap("mainMap");
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
    <div>
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
    </div>
  );
};
