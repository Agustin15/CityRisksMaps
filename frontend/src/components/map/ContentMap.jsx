import {
  AdvancedMarker,
  ControlPosition,
  MapControl
} from "@vis.gl/react-google-maps";
import { useMapControls } from "../../contexts/MapContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { useRoutes } from "../../contexts/routesContext/RoutesContext";
import { useSearchPlace } from "../../contexts/SearchPlaceContext";
import { useWindowResize } from "../../contexts/WindowResizeContext";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { MarkerOrigin } from "./markerOrigin/MarkerOrigin";
import { MarkersPlaces } from "./markersPlaces/MarkersPlaces";
import { MapHandler } from "./mapHandler/MapHandler";
import { MyLocation } from "./myLocation/MyLocation";
import { Navigation } from "./navigation/Navigation";
import { SearchPlace } from "./searchPlace/SearchPlace";
import { Geolocation } from "./geolocation/Geolocation";

export const ContentMap = ({ polygonSelected, markerRef, marker }) => {
  const { userLocation } = useMapControls();
  const { selectedPlace, placesSearched } = useSearchPlace();
  const { originLocation, destinationLocation } = useRoutes();
  const { routeNavigation } = useNavigation();
  const { windowWidth } = useWindowResize();

  return (
    <>
      <AdvancedMarker position={userLocation ? userLocation : null}>
        <MyLocation />
      </AdvancedMarker>

      <AdvancedMarker ref={markerRef} position={null}></AdvancedMarker>

      <MapControl
        position={
          windowWidth <= 650
            ? ControlPosition.TOP_CENTER
            : ControlPosition.TOP_LEFT
        }
      >
        {!routeNavigation && <SearchPlace />}
      </MapControl>

      <MapHandler place={selectedPlace} marker={marker} />

      {!routeNavigation && (
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <Geolocation />
        </MapControl>
      )}

      {polygonSelected && (
        <AdvancedMarker
          clickable={true}
          position={polygonSelected ? polygonSelected.data.center : null}
        >
          <InfoWindowNeighborhood polygonSelected={polygonSelected} />
        </AdvancedMarker>
      )}

      {placesSearched && <MarkersPlaces placesSearched={placesSearched} />}

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
        <MapControl position={ControlPosition.BOTTOM_CENTER}>
          <Navigation />
        </MapControl>
      )}
    </>
  );
};
