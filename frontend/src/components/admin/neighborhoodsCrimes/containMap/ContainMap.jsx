import style from "./ContainMap.module.css";
const MAP_ID_BACKOFFICE = import.meta.env.VITE_MAP_ID_BACKOFFICE;
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useApiIsLoaded,
  useMap
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import {
  boundsMontevideo,
  cleanPolygons,
  createCoordinatesNeighborhoods,
  createPolygons,
  handleMouseInNeighborhoodPolygon
} from "./functions.js";
import { useState } from "react";
import { useCrud } from "../../../../contexts/adminContext/CrudContext.jsx";
import { DetailsNeighborhood } from "./detailsNeighborhood/DetailsNeighborhood.jsx";

export const ContainMap = () => {
  const [neighborhoodsCoordinates, setNeighborhoodsCoordinates] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [polygonSelected, setPolygonSelected] = useState();

  const { registers, crimeSelected } = useCrud();
  const apiIsLoaded = useApiIsLoaded();
  const map = useMap("backofficeMap");

  useEffect(() => {
    if (!apiIsLoaded || !map) return;
    loadMap();
  }, [map]);

  const loadMap = async () => {
    const neighborhoodsCoordinatesFound = await createCoordinatesNeighborhoods(
      setNeighborhoodsCoordinates
    );

    setNeighborhoodsCoordinates(neighborhoodsCoordinatesFound);

    const bounds = await boundsMontevideo();

    map.setOptions({
      restriction: { latLngBounds: bounds, strictBounds: true }
    });
  };

  useEffect(() => {
    if (!registers || neighborhoodsCoordinates.length == 0) return;

    if (polygons.length > 0) cleanPolygons(polygons);

    const polygonsCreated = createPolygons(
      neighborhoodsCoordinates,
      registers,
      map
    );

    if (polygonsCreated.length == 0) return;

    setPolygons(polygonsCreated);
  }, [registers]);

  return (
    <div className={style.containMap}>
      <div className={style.box}>
        <Map
          id="backofficeMap"
          mapId={MAP_ID_BACKOFFICE}
          renderingType="VECTOR"
          style={{ width: "100%", height: "100%" }}
          defaultCenter={{ lat: -34.901112, lng: -56.164532 }}
          defaultZoom={6}
          disableDefaultUI
          zoomControl={true}
          onClick={(event) => event.stop()}
          onMousemove={(event) =>
            handleMouseInNeighborhoodPolygon(
              event,
              polygons,
              setPolygonSelected
            )
          }
        >
          {polygonSelected && (
            <AdvancedMarker position={polygonSelected.data.center}>
              <DetailsNeighborhood polygonSelected={polygonSelected} />
            </AdvancedMarker>
          )}
        </Map>
      </div>
    </div>
  );
};
