import style from "./ContainMap.module.css";
const MAP_ID = import.meta.env.VITE_MAP_ID;
import { Map, ControlPosition } from "@vis.gl/react-google-maps";
import { useWindowResize } from "../../contexts/WindowResizeContext.jsx";
import { useMapControls } from "../../contexts/MapContext";
import { useInteractionNeighborhoodsPolygons } from "../../contexts/neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext.jsx";
import { useNeighborhoodsCrimes } from "../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext.jsx";
import { useSearchPlace } from "../../contexts/searchPlaceContext/SearchPlaceContext";
import { OptionsMap } from "./optionsMap/OptionsMap.jsx";
import { ContentMap } from "./ContentMap.jsx";

export const ContainMap = () => {
  const { userLocation } = useMapControls();
  const { polygons } = useNeighborhoodsCrimes();
  const { handleClickOnMap } = useSearchPlace();
  const { handleMouseNeighborhoohdPolygon, setPolygonSelected } =
    useInteractionNeighborhoodsPolygons();
  const { windowWidth } = useWindowResize();

  return (
    <>
      <OptionsMap />
      <Map
        renderingType="VECTOR"
        gestureHandling="greedy"
        id="mainMap"
        mapId={MAP_ID}
        defaultZoom={15}
        disableDefaultUI
        className={style.map}
        defaultCenter={
          userLocation ? userLocation : { lat: -34.8340562, lng: -56.3622838 }
        }
        streetViewControl={false}
        zoomControl={false}
        onClick={(event) => {
          if (event.detail.placeId) {
            event.stop();
            handleClickOnMap(event);
          }
          if (windowWidth < 1200)
            handleMouseNeighborhoohdPolygon(
              event,
              polygons,
              setPolygonSelected,
            );
        }}
        onMousemove={(event) => {
          if (windowWidth < 1200) return;
          handleMouseNeighborhoohdPolygon(event, polygons, setPolygonSelected);
        }}
        onDblclick={(event) => {
          handleClickOnMap(event);
        }}
      >
        <ContentMap />
      </Map>
    </>
  );
};
