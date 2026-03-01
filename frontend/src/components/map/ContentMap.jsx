import {
  AdvancedMarker,
  ControlPosition,
  MapControl
} from "@vis.gl/react-google-maps";
import { useMapControls } from "../../contexts/MapContext";
import { useNavigation } from "../../contexts/navigationContext/NavigationContext";
import { useRoutes } from "../../contexts/routesContext/RoutesContext";
import { useSearchPlace } from "../../contexts/searchPlaceContext/SearchPlaceContext";
import { useWindowResize } from "../../contexts/WindowResizeContext";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { MarkerOrigin } from "./markerOrigin/MarkerOrigin";
import { MarkersPlaces } from "./markersPlaces/MarkersPlaces";
import { MapHandlerClick } from "./MapHandlerClick/MapHandlerClick";
import { MyLocation } from "./myLocation/MyLocation";
import { Navigation } from "./navigation/Navigation";
import { SearchPlace } from "./searchPlace/SearchPlace";
import { Geolocation } from "./geolocation/Geolocation";

export const ContentMap = ({ polygonSelected }) => {
  const { userLocation } = useMapControls();
  const { selectedPlace, placesSearched, streetSelected } = useSearchPlace();
  const { originLocation, destinationLocation } = useRoutes();
  const { routeNavigation } = useNavigation();
  const { windowWidth } = useWindowResize();

  return (
    <>
      <AdvancedMarker position={userLocation ? userLocation : null}>
        <MyLocation />
      </AdvancedMarker>

      <MapControl
        position={
          windowWidth <= 650
            ? ControlPosition.TOP_CENTER
            : ControlPosition.TOP_LEFT
        }
      >
        {!routeNavigation && <SearchPlace />}
      </MapControl>

      {!routeNavigation && (
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <Geolocation />
        </MapControl>
      )}

      {(selectedPlace || streetSelected) && <MapHandlerClick />}

      {placesSearched && <MarkersPlaces placesSearched={placesSearched} />}

      {polygonSelected && (
        <AdvancedMarker
          clickable={true}
          position={polygonSelected ? polygonSelected.data.center : null}
        >
          <InfoWindowNeighborhood polygonSelected={polygonSelected} />
        </AdvancedMarker>
      )}

      {originLocation && destinationLocation && !userLocation && (
        <AdvancedMarker
          position={{
            lat: originLocation.latitude,
            lng: originLocation.longitude
          }}
        >
          <MarkerOrigin />
        </AdvancedMarker>
      )}

      {routeNavigation && (
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <Navigation />
        </MapControl>
      )}
    </>
  );
};
