const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [neighborhoodsCoordinates, setNeighborhoodsCoordinates] = useState();
  const [loadingMyLocation, setLoadingMyLocation] = useState(false);
  const [userLocation, setUserLocation] = useState();
  const apiIsLoaded = useApiIsLoaded();
  const watchIdRef = useRef();
  const userLocationRef = useRef();
  const map = useMap("mainMap");

  useEffect(() => {
    if (!apiIsLoaded || !map) return;
    loadMap();
  }, [map]);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  const loadMap = async () => {
    await createNeighborhoodCoordinates();
    const bounds = await boundsMontevideo();

    map.setOptions({
      headingInteractionEnabled: true,
      tiltInteractionEnabled: true,
      gestureHandling: "greedy",
      heading: 0,
      tilt: 0,
      restriction: { latLngBounds: bounds, strictBounds: false }
    });
    handleMyLocation();
  };

  const handleMyLocation = async (option) => {
    setLoadingMyLocation(true);

    if (option == "current" && userLocation) {
      navigator.geolocation.getCurrentPosition(successCurrentPosition, error, {
        enableHighAccuracy: true,
        maximumAge: 0
      });
    } else {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);

      watchIdRef.current = navigator.geolocation.watchPosition(
        successWatchPosition,
        error,
        {
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );
    }
  };

  const success = (position) => {
    setUserLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });

    setLoadingMyLocation(false);
  };
  const successWatchPosition = (position) => {
    success(position);
    if (!userLocationRef.current) configMapGeolocation(position);
  };

  const successCurrentPosition = (position) => {
    success(position);
    configMapGeolocation(position);
  };

  const configMapGeolocation = (position) => {
    map.setZoom(15);
    map.panTo({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  };

  const error = (error) => {
    setLoadingMyLocation(false);

    alertSwalError(
      "Ups, no pudimos encontrar la ubicacion",
      error.code == 1
        ? "Permiso para acceder a la ubicacion, no habilitada"
        : "No se pudo obtener su ubicacion"
    );
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

      if (!response.ok)
        throw new Error(
          "Error en la solicitud para obtener las coordenadas de los barrios"
        );

      if (result) return result.features;
    } catch (error) {
      alertSwalError("Ups, algo salio mal", error.message);
    }
  };

  const createNeighborhoodCoordinates = async () => {
    const features = await getCoordinatesNeighbordhoods();
    if (!features) return;
    const neighborhoodsCoordinates = [];

    features.forEach((feature) => {
      neighborhoodsCoordinates.push({
        neighborhood: feature.properties.nombre,
        coordinates: formatCoordinates(feature.geometry.coordinates.flat())
      });
    });

    setNeighborhoodsCoordinates(neighborhoodsCoordinates);
  };

  const boundsMontevideo = async () => {
    try {
      const response = await fetch(LOCALHOST_FRONTEND + "/montevideo.json");
      const result = await response.json();

      if (!response.ok)
        throw new Error(
          "Hubo un error al cargar las coordenadas de la ciudad de Montevideo"
        );

      if (result) {
        const coordinatesMdveo = result.features[0].geometry.coordinates
          .flat()
          .flat();

        let bounds = new google.maps.LatLngBounds();

        if (coordinatesMdveo) {
          coordinatesMdveo.forEach((coordinate) =>
            bounds.extend({ lat: coordinate[1], lng: coordinate[0] })
          );

          return bounds;
        }
      }
    } catch (error) {
      alertSwalError("Ups, algo salio mal", error.message);
    }
  };

  return (
    <MapContext.Provider
      value={{
        handleMyLocation,
        userLocation,
        setUserLocation,
        loadingMyLocation,
        neighborhoodsCoordinates
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapControls = () => useContext(MapContext);
