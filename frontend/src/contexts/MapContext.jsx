const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import { createContext, useContext, useEffect, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [neighbordhoodsCoordinates, setNeighbordhoodsCoordinates] = useState();
  const [loadingMyLocation, setLoadingMyLocation] = useState(false);
  const [userLocation, setUserLocation] = useState();
  const apiIsLoaded = useApiIsLoaded();

  const map = useMap();

  useEffect(() => {
    if (!apiIsLoaded || !map) return;
    loadMap();
  }, [map]);

  const loadMap = async () => {
    await createNeighbordhoodCoordinates();
    handleMyLocation();
  };

  const handleMyLocation = async () => {
    setLoadingMyLocation(true);

    if (!userLocation) {
      navigator.geolocation.watchPosition(success, error, options);
    } else {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  };

  const formatCoordinates = (coordinates) => {
    return coordinates.map((coordinate) => {
      return { lat: coordinate[1], lng: coordinate[0] };
    });
  };

  const getCoordinatesNeighbordhoods = async () => {
    try {
      const response = await fetch(LOCALHOST_FRONTEND + "/barrios.json");
      const result = await response.json();

      if (result) return result.features;
      return null;
    } catch (error) {
      console.log(error);
    }
  };

  const createNeighbordhoodCoordinates = async () => {
    const features = await getCoordinatesNeighbordhoods();
    const neighbordhoodsCoordinates = [];

    if (features) {
      features.forEach((feature) => {
        neighbordhoodsCoordinates.push({
          neighborhood: feature.properties.nombre,
          coordinates: formatCoordinates(feature.geometry.coordinates.flat())
        });
      });

      setNeighbordhoodsCoordinates(neighbordhoodsCoordinates);
    }
  };

  const success = (pos) => {
    const crd = pos.coords;

    setUserLocation({
      lat: crd.latitude,
      lng: crd.longitude
    });

    map.setZoom(15);
    map.panTo({ lat: crd.latitude, lng: crd.longitude });
    setLoadingMyLocation(false);
  };

  const error = (error) => {
    setLoadingMyLocation(false);
    alertSwalError(
      "Ups, no pudimos encontrar la ubicacion",
      error.code == 1
        ? "Permiso para acceder a la ubicacion no habilitado"
        : "No se pudo obtener su ubicacion"
    );
  };
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0
  };

  return (
    <MapContext.Provider
      value={{
        handleMyLocation,
        userLocation,
        loadingMyLocation,
        neighbordhoodsCoordinates
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapControls = () => useContext(MapContext);
