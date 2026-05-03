import { useMap } from "@vis.gl/react-google-maps";
import { createContext, useContext, useState } from "react";

export const InteractionNeighborhoodsPolygonsContext = createContext();

export const InteractionNeighborhoodsPolygonsProvider = ({ children }) => {
  const [polygons, setPolygons] = useState([]);
  const [polygonSelected, setPolygonSelected] = useState();
  const map = useMap("backofficeMap");

  const cleanPolygons = () => {
    polygons.map((polygon) => polygon.setMap(null));
  };

  const handleMouseInNeighborhoodPolygon = (event) => {
    const latLng = event.detail.latLng;

    const polygonFound = polygons.find((polygon) =>
      google.maps.geometry.poly.containsLocation(latLng, polygon)
    );

    if (polygonFound) {
      setPolygonSelected(polygonFound);
    } else setPolygonSelected(null);
  };

  const focusNeighborhoodPolygon = (nameNeighborhood) => {
    const latLng = event.detail.latLng;

    setPolygons(
      polygons.map((polygon) => {
        if (polygon.data.neighborhood == nameNeighborhood) {
          polygon.setOptions({
            strokeColor:
              polygon.strokeColor == "#148d1e" ? "#8d8d8dff" : "#148d1e",
            strokeWeight: polygon.strokeWeight == 1 ? 5 : 1
          });
          map.setZoom(12);
          map.panTo(polygon.data.center);
        } else {
          polygon.setOptions({ strokeColor: "#8d8d8dff", strokeWeight: 1 });
        }
        return polygon;
      })
    );
  };

  return (
    <InteractionNeighborhoodsPolygonsContext.Provider
      value={{
        handleMouseInNeighborhoodPolygon,
        focusNeighborhoodPolygon,
        cleanPolygons,
        setPolygonSelected,
        polygonSelected,
        setPolygons,
        polygons
      }}
    >
      {children}
    </InteractionNeighborhoodsPolygonsContext.Provider>
  );
};

export const useInteractionNeighborhoodsPolygons = () =>
  useContext(InteractionNeighborhoodsPolygonsContext);
