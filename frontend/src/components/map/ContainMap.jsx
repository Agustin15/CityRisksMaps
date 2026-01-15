import {
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";
const MAP_ID = import.meta.env.VITE_MAP_ID;
import style from "./ContainMap.module.css";

import { useState } from "react";
import { useMapControls } from "../../contexts/MapContext";
import { useZoneCrimes } from "../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useSearchPlace } from "../../contexts/SearchPlaceContext.jsx";
import { useRoutes } from "../../contexts/routesContext/RoutesContext.jsx";
import { useNavigation } from "../../contexts/NavigationContext.jsx";
import { MyLocation } from "./myLocation/MyLocation";
import { MapHandler } from "./mapHandler/MapHandler";
import { SearchPlace } from "./searchPlace/SearchPlace.jsx";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { handleMouseNeighborhoohdPolygon } from "./handleNeighborhhodPolygon/handleMouseNeighborhood.js";
import { MarkersPlaces } from "./markersPlaces/MarkersPlaces.jsx";
import { Geolocation } from "./geolocation/Geolocation.jsx";
import { OptionsMap } from "./optionsMap/OptionsMap.jsx";
import { MarkerOrigin } from "./markerOrigin/MarkerOrigin.jsx";

export const ContainMap = () => {
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();
  const { selectedPlace, placesSearched, handleClickOnMap } = useSearchPlace();
  const { originLocation, destinyLocation } = useRoutes();
  const { routeNavigation } = useNavigation();

  const [polygonSelected, setPolygonSelected] = useState();

  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <Map
        renderingType="VECTOR"
        className={style.map}
        disableDefaultUI
        defaultZoom={15}
        defaultCenter={{ lat: -34.8340562, lng: -56.3622838 }}
        streetViewControl={true}
        streetViewControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        onClick={(event) => handleClickOnMap(event, marker)}
        onMousemove={(event) =>
          handleMouseNeighborhoohdPolygon(event, polygons, setPolygonSelected)
        }
        zoomControl={true}
        zoomControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        gestureHandling="greedy"
        mapId={MAP_ID}
      >
        <AdvancedMarker position={userLocation ? userLocation : null}>
          <MyLocation />
        </AdvancedMarker>

        <AdvancedMarker ref={markerRef} position={null}></AdvancedMarker>

        <MapControl
          position={
            window.innerWidth > 760
              ? ControlPosition.TOP_LEFT
              : ControlPosition.TOP_CENTER
          }
        >
          <SearchPlace />
        </MapControl>

        <MapHandler place={selectedPlace} marker={marker} />

        {!routeNavigation && (
          <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            <Geolocation />
          </MapControl>
        )}

        {polygonSelected && (
          <AdvancedMarker
            position={polygonSelected ? polygonSelected.data.center : null}
          >
            <InfoWindowNeighborhood polygonSelected={polygonSelected} />
          </AdvancedMarker>
        )}

        {placesSearched && <MarkersPlaces placesSearched={placesSearched} />}

        {originLocation && destinyLocation && !userLocation && (
          <AdvancedMarker
            position={{
              lat: originLocation.latitude,
              lng: originLocation.longitude
            }}
          >
            <MarkerOrigin />
          </AdvancedMarker>
        )}
      </Map>

      <OptionsMap />
    </>
  );
};
