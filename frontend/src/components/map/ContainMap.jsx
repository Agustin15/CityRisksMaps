import {
  Map,
  ControlPosition,
  useAdvancedMarkerRef,
  useMap
} from "@vis.gl/react-google-maps";
const MAP_ID = import.meta.env.VITE_MAP_ID;
import style from "./ContainMap.module.css";

import { useState } from "react";
import { useMapControls } from "../../contexts/MapContext";
import { useZoneCrimes } from "../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useSearchPlace } from "../../contexts/SearchPlaceContext.jsx";
import { useNavigation } from "../../contexts/NavigationContext.jsx";
import { handleMouseNeighborhoohdPolygon } from "./handleNeighborhhodPolygon/handleMouseNeighborhood.js";
import { OptionsMap } from "./optionsMap/OptionsMap.jsx";
import { ContentMap } from "./ContentMap.jsx";
import { useWindowResize } from "../../contexts/WindowResizeContext.jsx";

export const ContainMap = () => {
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();
  const { handleClickOnMap } = useSearchPlace();
  const { routeNavigation } = useNavigation();
  const { windowWidth } = useWindowResize();
  const [polygonSelected, setPolygonSelected] = useState();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [drawMode, setDrawMode] = useState();

  return (
    <>
      <Map
        renderingType="VECTOR"
        className={!routeNavigation ? style.map : style.mapNavigation}
        disableDefaultUI
        defaultZoom={15}
        defaultCenter={
          userLocation ? userLocation : { lat: -34.8340562, lng: -56.3622838 }
        }
        streetViewControl={true}
        streetViewControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        onClick={(event) => {
          if (routeNavigation || drawMode) return;
          handleClickOnMap(event, marker);
        }}
        onMousemove={(event) => {
          if (windowWidth < 1200) return;
          handleMouseNeighborhoohdPolygon(event, polygons, setPolygonSelected);
        }}
        zoomControl={true}
        zoomControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        gestureHandling="greedy"
        mapId={MAP_ID}
      >
        <ContentMap
          polygonSelected={polygonSelected}
          markerRef={markerRef}
          marker={marker}
          drawMode={drawMode}
          setDrawMode={setDrawMode}
        />
      </Map>

      <OptionsMap />
    </>
  );
};
