const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [infoWindow, setInfoWindow] = useState();
  const [valueInput, setValueInput] = useState("");
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

  const handleClickOnMap = async (event, marker, setSelectedPlace) => {
    if (event.detail.placeId) {
      setInfoWindow();
      let placesDetails = await moreDetailsPlace(event.detail.placeId);
      setValueInput(placesDetails.displayName.text);
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

      if (result.status == "OK" && result.address_descriptor.areas.length > 0)
        setInfoWindow(result);
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

  return (
    <MapContext.Provider
      value={{
        handleMyLocation,
        handleClickOnMap,
        moreDetailsPlace,
        infoWindow,
        setInfoWindow,
        userLocation,
        loadingMyLocation,
        valueInput,
        setValueInput,
        neighbordhoodsCoordinates
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapControls = () => useContext(MapContext);
