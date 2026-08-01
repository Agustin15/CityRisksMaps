import {
  AdvancedMarker,
  ControlPosition,
  MapControl,
} from "@vis.gl/react-google-maps";

import { useMapControls } from "../../contexts/MapContext";
import { useInteractionNeighborhoodsPolygons } from "../../contexts/neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext";
import { useSearchPlace } from "../../contexts/searchPlaceContext/SearchPlaceContext";
import { useWindowResize } from "../../contexts/WindowResizeContext";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { MarkerOrigin } from "./markerOrigin/MarkerOrigin";
import { MarkersPlaces } from "./markersPlaces/MarkersPlaces";
import { MapHandlerClick } from "./MapHandlerClick/MapHandlerClick";
import { MyLocation } from "./myLocation/MyLocation";
import { SearchPlace } from "./searchPlace/SearchPlace";
import { MenuOnMap } from "./menuOnMap/MenuOnMap";

export const ContentMap = () => {
  const { userLocation } = useMapControls();
  const { selectedPlace, placesSearched, streetSelected } = useSearchPlace();
  const { polygonSelected } = useInteractionNeighborhoodsPolygons();
  const { windowWidth } = useWindowResize();

  return (
    <>
      <AdvancedMarker position={userLocation ? userLocation : null}>
        <MyLocation position={userLocation} />
      </AdvancedMarker>

      <MapControl
        position={
          windowWidth <= 650
            ? ControlPosition.TOP_CENTER
            : ControlPosition.TOP_LEFT
        }
      >
        <SearchPlace />
      </MapControl>

      <MapControl position={ControlPosition.RIGHT_BOTTOM}>
        <MenuOnMap />
      </MapControl>

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

   
    </>
  );
};
