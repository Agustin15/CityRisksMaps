const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [neighbordhoodsCoordinates, setNeighbordhoodsCoordinates] = useState();
  const [loadingMyLocation, setLoadingMyLocation] = useState(false);
  const [idWatchPosition, setIdWatchPosition] = useState();
  const [userLocation, setUserLocation] = useState();
  const userLocationRef = useRef();
  const apiIsLoaded = useApiIsLoaded();

  const map = useMap();

  useEffect(() => {
    if (!apiIsLoaded || !map) return;
    loadMap();
  }, [map]);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  const loadMap = async () => {
    await createNeighbordhoodCoordinates();
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

    if (idWatchPosition && option != "current") return;

    if (option == "current") {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      const idWatch = navigator.geolocation.watchPosition(
        success,
        error,
        options
      );
      setIdWatchPosition(idWatch);
    }
  };

  const success = (pos) => {
    const crd = pos.coords;

    if (
      !userLocationRef.current ||
      crd.latitude != userLocationRef.current.lat ||
      crd.longitude != userLocationRef.current.lng
    ) {
      setUserLocation({
        lat: crd.latitude,
        lng: crd.longitude
      });

      map.setZoom(15);
      map.panTo({ lat: crd.latitude, lng: crd.longitude });
      setLoadingMyLocation(false);
    } else return;
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
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0
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
      alertSwalError(
        "Ups,sin coordenas de barrios",
        "Hubo un error al cargar las coordenadas de los barrios"
      );
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

  const boundsMontevideo = async () => {
    try {
      const response = await fetch(LOCALHOST_FRONTEND + "/montevideo.json");
      const result = await response.json();

      if (!response.ok)
        throw new Error("Error al cargar las coordenas de Montevideo");

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
      alertSwalError("Ups, algo salio mal", error);
    }
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
