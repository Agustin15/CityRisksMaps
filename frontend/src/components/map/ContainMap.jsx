import style from "./ContainMap.module.css";
import { Map, ControlPosition } from "@vis.gl/react-google-maps";
const MAP_ID = import.meta.env.VITE_MAP_ID;
import { useWindowResize } from "../../contexts/WindowResizeContext.jsx";
import { useMapControls } from "../../contexts/MapContext";
import { useInteractionNeighborhoodsPolygons } from "../../contexts/neighborhoodsCrimesContext/InteractionNeighborhoodsPolygonsContext.jsx";
import { useNeighborhoodsCrimes } from "../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext.jsx";
import { useSearchPlace } from "../../contexts/searchPlaceContext/SearchPlaceContext";
import { useNavigation } from "../../contexts/navigationContext/NavigationContext.jsx";
import { OptionsMap } from "./optionsMap/OptionsMap.jsx";
import { ContentMap } from "./ContentMap.jsx";

export const ContainMap = () => {
  const { userLocation } = useMapControls();
  const { polygons } = useNeighborhoodsCrimes();
  const { handleClickOnMap } = useSearchPlace();
  const { routeNavigation, editRoute } = useNavigation();
  const { handleMouseNeighborhoohdPolygon, setPolygonSelected } =
    useInteractionNeighborhoodsPolygons();
  const { windowWidth } = useWindowResize();

  return (
    <>
      <Map
        renderingType="VECTOR"
        gestureHandling="greedy"
        id="mainMap"
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
          }
          if (windowWidth < 1200 && !editRoute)
            handleMouseNeighborhoohdPolygon(
              event,
              polygons,
              setPolygonSelected
            );
        }}
        onMousemove={(event) => {
          if (windowWidth < 1200 || editRoute) return;
          handleMouseNeighborhoohdPolygon(event, polygons, setPolygonSelected);
        }}
        onDblclick={(event) => {
          if (routeNavigation) return;
          handleClickOnMap(event);
        }}
      >
        <ContentMap />
      </Map>

      <OptionsMap />
    </>
  );
};
