import { createContext, useContext, useState } from "react";
import { alertSwalError } from "../../components/sweetAlert/sweetAlert.js";
import { useMap } from "@vis.gl/react-google-maps";
import { useZoneCrimes } from "../zoneCrimesContext/ZoneCrimesContext.jsx";
import { createDataRoutes } from "./functions.js";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [showMenuRoutes, setShowMenuRoutes] = useState(false);
  const [destiny, setDestiny] = useState("");
  const [origin, setOrigin] = useState("");
  const [originLocation, setOriginLocation] = useState();
  const [destinyLocation, setDestinyLocation] = useState();
  const [transportSelected, setTransportSelected] = useState();
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [routes, setRoutes] = useState();
  const [routeSelected, setRouteSelected] = useState();
  const [polylines, setPolylines] = useState();
  const [polylinesBackground, setPolylinesBackground] = useState();
  const map = useMap();
  const { polygons, crimeSelected } = useZoneCrimes();

  const handleClickRoute = (place) => {
    setShowMenuRoutes(true);
    setDestiny(place.formattedAddress);
    setDestinyLocation(place.location);
  };

  const showRoutes = async (travelMode) => {
    setRoutes();
    cleanPolylines();

    setTransportSelected(travelMode);
    setLoadingRoutes(true);

    try {
      const response = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask":
              "routes.duration,routes.distanceMeters,routes.polyline,routes.polyline.encodedPolyline,routes.legs"
          },
          body: JSON.stringify({
            origin: {
              location: { latLng: originLocation }
            },
            destination: {
              location: { latLng: destinyLocation }
            },
            travelMode: travelMode,
            computeAlternativeRoutes: true,
            routeModifiers: {
              avoidTolls: false,
              avoidHighways: false,
              avoidFerries: false
            },
            languageCode: "es-419"
          })
        }
      );
      const result = await response.json();

      if (!response.ok) throw new Error(result.error.message);

      let option = crimeSelected ? "homicides" : "quizes";

      const resultDataRoutes = createDataRoutes(
        result.routes,
        polygons,
        map,
        option
      );
      if (resultDataRoutes) {
        setRoutes(resultDataRoutes.routes);
        setPolylinesBackground(resultDataRoutes.polylinesBackground);
        setPolylines(resultDataRoutes.polylines);
        setRouteSelected(0);
      }
    } catch (error) {
      console.log(error);
      alertSwalError(
        "Ups,rutas no encontradas",
        "Hubo un error al obtener las rutas"
      );
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleClose = async (setSuggestions) => {
    if (setSuggestions) setSuggestions();

    cleanPolylines();
    setOrigin("");
    setDestiny("");
    setOriginLocation();
    setDestinyLocation();
    setRoutes();
    setTransportSelected();
    setRouteSelected();
    setShowMenuRoutes(false);
    setLoadingRoutes(false);
  };

  const cleanPolylines = () => {
    if (polylines) {
      polylines.map((polyline) => polyline.setMap(null));
      polylinesBackground.map((polyline) => polyline.setMap(null));

      setPolylines();
      setPolylinesBackground();
    }
  };

  return (
    <RoutesContext.Provider
      value={{
        showMenuRoutes,
        setShowMenuRoutes,
        handleClickRoute,
        origin,
        destiny,
        setOrigin,
        setDestiny,
        setOriginLocation,
        originLocation,
        destinyLocation,
        setDestinyLocation,
        setTransportSelected,
        polylines,
        setPolylines,
        cleanPolylines,
        polylinesBackground,
        setPolylinesBackground,
        transportSelected,
        loadingRoutes,
        routes,
        setRoutes,
        showRoutes,
        routeSelected,
        setRouteSelected,
        handleClose
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = () => useContext(RoutesContext);
