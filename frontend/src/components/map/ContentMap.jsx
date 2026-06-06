import {
  AdvancedMarker,
  ControlPosition,
  MapControl
} from "@vis.gl/react-google-maps";

import { useMapControls } from "../../contexts/MapContext";
import { useNavigation } from "../../contexts/navigationContext/NavigationContext";
import { useRoutes } from "../../contexts/routesContext/RoutesContext";
import { useInteractionNeighborhoodsPolygons } from "../../contexts/neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext";
import { useSearchPlace } from "../../contexts/searchPlaceContext/SearchPlaceContext";
import { useWindowResize } from "../../contexts/WindowResizeContext";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { MarkerOrigin } from "./markerOrigin/MarkerOrigin";
import { MarkersPlaces } from "./markersPlaces/MarkersPlaces";
import { MapHandlerClick } from "./MapHandlerClick/MapHandlerClick";
import { MyLocation } from "./myLocation/MyLocation";
import { Navigation } from "./navigation/Navigation";
import { SearchPlace } from "./searchPlace/SearchPlace";
import { MenuOnMap } from "./menuOnMap/MenuOnMap";

export const ContentMap = () => {
  const { userLocation } = useMapControls();
  const { selectedPlace, placesSearched, streetSelected } = useSearchPlace();
  const { polygonSelected } = useInteractionNeighborhoodsPolygons();
  const { originLocation, destinationLocation } = useRoutes();
  const { routeNavigation, currentStep } = useNavigation();
  const { windowWidth } = useWindowResize();

  return (
    <>
      <AdvancedMarker position={userLocation ? userLocation : null}>
        <MyLocation position={userLocation} />
      </AdvancedMarker>

      {!routeNavigation && (
        <MapControl
          position={
            windowWidth <= 650
              ? ControlPosition.TOP_CENTER
              : ControlPosition.TOP_LEFT
          }
        >
          <SearchPlace />
        </MapControl>
      )}

      {!routeNavigation && (
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <MenuOnMap />
        </MapControl>
      )}

      {(selectedPlace || streetSelected) && <MapHandlerClick />}

      {placesSearched && <MarkersPlaces placesSearched={placesSearched} />}

      {polygonSelected && (
        <AdvancedMarker
          clickable={true}
          position={polygonSelected ? polygonSelected.data.center : null}
        >
          <InfoWindowNeighborhood />
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

      {routeNavigation && currentStep && (
        <MapControl position={ControlPosition.RIGHT_CENTER}>
          <Navigation />
        </MapControl>
      )}
    </>
  );
};
