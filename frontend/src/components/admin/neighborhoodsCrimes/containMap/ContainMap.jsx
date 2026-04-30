import style from "./ContainMap.module.css";
const MAP_ID_BACKOFFICE = import.meta.env.VITE_MAP_ID_BACKOFFICE;
import {
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
  createPolygons
} from "./functions.js";
import { useState } from "react";
import { useCrud } from "../../../../contexts/adminContext/CrudContext.jsx";

export const ContainMap = () => {
  const [neighborhoodsCoordinates, setNeighborhoodsCoordinates] = useState([]);
  const [polygons, setPolygons] = useState([]);
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
      <Map
        id="backofficeMap"
        mapId={MAP_ID_BACKOFFICE}
        renderingType="VECTOR"
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: -34.901112, lng: -56.164532 }}
        defaultZoom={6}
        disableDefaultUI
        zoomControl={true}
      />
    </div>
  );
};
