const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import iconGeolocaton from "../assets/img/myLocation.png";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [infoWindow, setInfoWindow] = useState();
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
      <img width="33px" height="33px" src=${iconGeolocaton}>
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

  const handleClickOnMap = async (event, marker, setSelectedPlace) => {
    if (event.detail.placeId) {
      let placesDetails = await moreDetailsPlace(event.detail.placeId);

      setSelectedPlace(placesDetails);
    } else {
      setSelectedPlace();
      marker.position = event.detail.latLng;
      getReverseGeocodification(event.detail.latLng);
    }
  };

  const moreDetailsPlace = async (placeId) => {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=*&languageCode=es&key=${API_KEY}`
      );

      const result = await response.json();

      if (result) return result;
    } catch (error) {
      console.log(error);
    }
  };

  const getReverseGeocodification = async (latLng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&extra_computations=ADDRESS_DESCRIPTORS&extra_computations=BUILDING_AND_ENTRANCES&key=${API_KEY} `
      );

      const result = await response.json();
      if (result.status == "OK") setInfoWindow(result);
      else
        alertSwalError(
          "Ups,no pudimos encontrar la ubicacion",
          "Error inesperado en la geocodificacion"
        );

      return;
    } catch (error) {
      console.log(error);
    }
  };

  const getPhotoDetails = async (namePhoto) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/${namePhoto}/media?key=${API_KEY}&maxHeightPx=240&maxWidthPx=384`
      );

      const result = response.url;
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MapContext.Provider
      value={{
        handleMyLocation,
        handleClickOnMap,
        moreDetailsPlace,
        infoWindow,
        setInfoWindow,
        markerUserLocation,
        getPhotoDetails,
        loading
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapControls = () => useContext(MapContext);
