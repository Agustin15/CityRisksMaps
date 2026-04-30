import { useMap } from "@vis.gl/react-google-maps";
import { useMapControls } from "../MapContext";
import { useNeighborhoodsCrimes } from "./NeighborhoodsCrimesContextContext";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const InteractionNeighborhoodsPolygonsContext = createContext();

export const InteractionNeighborhoodsPolygonsProvider = ({ children }) => {
  const [idIntervalAnimation, setIdIntervalAnimation] = useState();
  const refIdIntervalAnimation = useRef();
  const [polygonSelected, setPolygonSelected] = useState();
  const { neighbordhoodsCoordinates } = useMapControls();
  const { polygons } = useNeighborhoodsCrimes();
  const map = useMap("mainMap");

  useEffect(() => {
    refIdIntervalAnimation.current = idIntervalAnimation;
  }, [idIntervalAnimation]);

  const getPolygonCenter = (polygonCoordinates) => {
    const bounds = new google.maps.LatLngBounds();

    polygonCoordinates.forEach((coordinate) => {
      bounds.extend(coordinate);
    });

    return bounds.getCenter();
  };

  const focusPolygon = (neighborhood) => {
    const nhCoordinatesFound = neighbordhoodsCoordinates.find(
      (nhCoordinates) => nhCoordinates.neighborhood == neighborhood
    );

    polygons.forEach((polygon) => {
      if (
        polygon.data.name == neighborhood &&
        polygon.strokeColor != "#00bd10ff"
      ) {
        polygon.setOptions({
          strokeColor: "#00bd10ff",
          strokeOpacity: 1.0,
          strokeWeight: 11
        });

        const polygonCenter = getPolygonCenter(nhCoordinatesFound.coordinates);

        map.panTo(polygonCenter);
        animationCameraNeighborhood(polygonCenter);
      } else {
        polygon.setOptions({
          strokeColor: "#8d8d8dff",
          strokeOpacity: 1.0,
          strokeWeight: 1
        });
      }
    });
  };

  const animationCameraNeighborhood = (neighborhoodCenter) => {
    if (idIntervalAnimation) clearInterval(idIntervalAnimation);

    const cameraOptions = {
      center: neighborhoodCenter,
      heading: map.getHeading(),
      tilt: map.getTilt(),
      zoom: map.getZoom()
    };

    map.moveCamera(cameraOptions);

    const idInterval = setInterval(() => {
      map.moveCamera({
        center: neighborhoodCenter,
        heading: map.getHeading() + 0.5,
        tilt: map.getTilt() + 0.5,
        zoom: map.getZoom() >= 18 ? map.getZoom() : map.getZoom() + 0.09
      });
    }, 10);

    setIdIntervalAnimation(idInterval);

    setTimeout(() => {
      clearInterval(refIdIntervalAnimation.current);
    }, 5000);
  };

  const handleMouseNeighborhoohdPolygon = (event) => {
   
    let polygonFound = null;
    if (polygons) {
      for (const polygon of polygons) {
        if (
          google.maps.geometry.poly.containsLocation(
            event.detail.latLng,
            polygon
          )
        ) {
          polygonFound = polygon;
          polygonFound.data.center = getPolygonCenter(
            polygonFound.data.coordinates
          );
          break;
        }
      }
    }

    if (polygonFound) {
      setPolygonSelected(polygonFound);
    } else setPolygonSelected();
  };

  return (
    <InteractionNeighborhoodsPolygonsContext.Provider
      value={{
        focusPolygon,
        handleMouseNeighborhoohdPolygon,
        polygonSelected,
        setPolygonSelected
      }}
    >
      {children}
    </InteractionNeighborhoodsPolygonsContext.Provider>
  );
};

export const useInteractionNeighborhoodsPolygons = () =>
  useContext(InteractionNeighborhoodsPolygonsContext);
