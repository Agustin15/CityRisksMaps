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
import { MyLocation } from "./myLocation/MyLocation";
import { MapHandler } from "./mapHandler/MapHandler";
import { SearchPlace } from "./searchPlace/SearchPlace.jsx";
import { DetailsStreet } from "./detailsStreet/DetailsStreet";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { handleMouseNeighborhoohdPolygon } from "./handleNeighborhhodPolygon/handleMouseNeighborhood.js";
import { MarkersPlaces } from "./markersPlaces/MarkersPlaces.jsx";
import { Geolocation } from "./geolocation/Geolocation.jsx";
import { Tools } from "./tools/Tools.jsx";
import { MarkerOrigin } from "./markerOrigin/MarkerOrigin.jsx";

export const ContainMap = () => {
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();
  const { originLocation, destinyLocation } = useRoutes();

  const {
    selectedPlace,
    placesSearched,
    infoWindow,
    setInfoWindow,
    handleClickOnMap
  } = useSearchPlace();

  const [polygonSelected, setPolygonSelected] = useState();
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <Map
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

        <MapControl position={ControlPosition.TOP_LEFT}>
          <SearchPlace />
        </MapControl>

        <MapHandler place={selectedPlace} marker={marker} />

        <MapControl position={ControlPosition.BOTTOM_CENTER}>
          {infoWindow && (
            <DetailsStreet
              infoWindow={infoWindow}
              setInfoWindow={setInfoWindow}
            />
          )}
        </MapControl>

        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <Geolocation />
        </MapControl>

        {polygonSelected && (
          <AdvancedMarker
            position={polygonSelected ? polygonSelected.data.center : null}
          >
            <InfoWindowNeighborhood polygonSelected={polygonSelected} />
          </AdvancedMarker>
        )}

        {placesSearched && <MarkersPlaces placesSearched={placesSearched} />}

        {originLocation && destinyLocation && (
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

      <Tools />
    </>
  );
};
