import { createContext, useContext, useEffect, useRef } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import iconGeolocaton from "../assets/img/myLocation.png";
import styles from "../components/map/placeDetails/PlaceDetails.module.css";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const markerUserLocation = useRef();
  const apiIsLoaded = useApiIsLoaded();
  const map = useMap();

  useEffect(() => {
    if (!apiIsLoaded || !map) return;

    handleMyLocation();
    createControlGeolocation();
  }, [map]);

  const createControlGeolocation = () => {
    const controlGeolocation = document.createElement("button");
    controlGeolocation.style.background = "white";
    controlGeolocation.style.display = "flex";
    controlGeolocation.style.justifyContent = "center";
    controlGeolocation.style.alignItems = "center";
    controlGeolocation.style.cursor = "pointer";
    controlGeolocation.style.border = "none";
    controlGeolocation.style.marginRight = "0.6rem";
    controlGeolocation.style.width = "2.5rem";
    controlGeolocation.style.height = "2.5rem";

    controlGeolocation.innerHTML = `
      <img width="22px" height="22px" src=${iconGeolocaton}>
    `;

    controlGeolocation.addEventListener("click", () => {
      handleMyLocation();
    });

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      controlGeolocation
    );
  };

  const handleMyLocation = async () => {
    if (markerUserLocation.current && !markerUserLocation.current.position) {
      navigator.geolocation.watchPosition(success, error, options);
    } else navigator.geolocation.getCurrentPosition(success, error, options);
  };

  const success = (pos) => {
    const crd = pos.coords;

    markerUserLocation.current.position = {
      lat: crd.latitude,
      lng: crd.longitude
    };

    map.setZoom(15);
    map.panTo({ lat: crd.latitude, lng: crd.longitude });
  };

  const error = (error) => {
    alertSwalError(
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
    <MapContext.Provider value={{ handleMyLocation, markerUserLocation }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapControls = () => useContext(MapContext);
