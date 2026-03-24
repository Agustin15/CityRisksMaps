import { Map, ControlPosition } from "@vis.gl/react-google-maps";

const MAP_ID = import.meta.env.VITE_MAP_ID;
import style from "./ContainMap.module.css";

import { useState } from "react";
import { useMapControls } from "../../contexts/MapContext";
import { useZoneCrimes } from "../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useSearchPlace } from "../../contexts/searchPlaceContext/SearchPlaceContext";
import { useNavigation } from "../../contexts/navigationContext/NavigationContext.jsx";
import { handleMouseNeighborhoohdPolygon } from "./handleNeighborhhodPolygon/handleMouseNeighborhood.js";
import { OptionsMap } from "./optionsMap/OptionsMap.jsx";
import { ContentMap } from "./ContentMap.jsx";

export const ContainMap = () => {
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();
  const { handleClickOnMap } = useSearchPlace();
  const { routeNavigation } = useNavigation();
  const [polygonSelected, setPolygonSelected] = useState();

  return (
    <>
      <Map
        renderingType="VECTOR"
        gestureHandling="greedy"
        mapId={MAP_ID}
        defaultZoom={15}
        disableDefaultUI
        className={!routeNavigation ? style.map : style.mapNavigation}
        defaultCenter={
          userLocation ? userLocation : { lat: -34.8340562, lng: -56.3622838 }
        }
        streetViewControl={true}
        streetViewControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        zoomControl={true}
        zoomControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        onClick={(event) => {
          if (event.detail.placeId && !routeNavigation) {
            event.stop();
            handleClickOnMap(event);
          } else if (!routeNavigation)
            handleMouseNeighborhoohdPolygon(
              event,
              polygons,
              setPolygonSelected
            );
        }}
        onDblclick={(event) => {
          if (routeNavigation) return;
          handleClickOnMap(event);
        }}
      >
        <ContentMap polygonSelected={polygonSelected} />
      </Map>

      <OptionsMap />
    </>
  );
};
