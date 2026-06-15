const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [neighborhoodsCoordinates, setNeighborhoodsCoordinates] = useState();
  const [loadingMyLocation, setLoadingMyLocation] = useState(false);
  const [userLocation, setUserLocation] = useState();
  const [errorLocation, setErrorLocation] = useState();
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
    setErrorLocation();
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

    setErrorLocation(
      error.code == 1
        ? "Habilite la ubicacion de su dispositivo"
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
    let bounds = new google.maps.LatLngBounds();

    const coordinates = [
      { lat: -34.79802331132657, lng: -56.429910548606806 },
      { lat: -34.700543328543425, lng: -56.345557320152466 },
      { lat: -34.66250391544962, lng: -56.16161286068436 },
      { lat: -34.761817117609795, lng: -55.95192235995849 },
      { lat: -34.865172511112036, lng: -55.97298863391291 },
      { lat: -34.97521506887102, lng: -56.18232148442671 },
      { lat: -34.943533158593134, lng: -56.327468652553065 },
      { lat: -34.88312429821043, lng: -56.43322915194158 }
    ];

    coordinates.map((coordinate) => bounds.extend(coordinate));

    return bounds;
  };

  return (
    <MapContext.Provider
      value={{
        handleMyLocation,
        errorLocation,
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
