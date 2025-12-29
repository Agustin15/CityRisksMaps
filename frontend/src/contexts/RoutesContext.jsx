import { createContext, useContext, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useMap } from "@vis.gl/react-google-maps";
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [showMenuRoutes, setShowMenuRoutes] = useState(false);
  const [destiny, setDestiny] = useState("");
  const [origin, setOrigin] = useState("");
  const [originLocation, setOriginLocation] = useState();
  const [destinyLocation, setDestinyLocation] = useState();
  const [transportSelected, setTransportSelected] = useState();
  const [routes, setRoutes] = useState();
  const [routeSelected, setRouteSelected] = useState();
  const [polylines, setPolylines] = useState();
  const map = useMap();

  const handleClickRoute = (place) => {
    setShowMenuRoutes(true);
    setDestiny(place.formattedAddress);
    setDestinyLocation(place.location);
  };

  const drawRoute = (routes) => {
    const polylines = [];

    routes.map((route) => {
      const pathRoute = new google.maps.geometry.encoding.decodePath(
        route.polyline.encodedPolyline
      );

      const polylineRoute = new google.maps.Polyline({
        path: pathRoute,
        strokeWeight: 7,
        strokeColor: "#275bbdff"
      });
      polylineRoute.setMap(map);

      polylines.push(polylineRoute);
    });

    setPolylines(polylines);
  };

  const showRoutes = async (travelMode) => {
    setTransportSelected(travelMode);
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
              address: origin
            },
            destination: {
              address: destiny
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

      drawRoute(result.routes);
      setRoutes(result.routes);
      setRouteSelected(0);
    } catch (error) {
      console.log(error);
      alertSwalError(
        "Ups,rutas no encontradas",
        "Hubo un error al obtener las rutas"
      );
    }
  };

  const handleClose = async (setSuggestions) => {
    if (polylines) {
      polylines.map((polyline) => polyline.setMap(null));

      setPolylines();
    }
    setSuggestions();
    setOrigin("");
    setDestiny("");
    setOriginLocation();
    setDestinyLocation();
    setRoutes();
    setTransportSelected();
    setRouteSelected();
    setShowMenuRoutes(false);
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
        transportSelected,
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
