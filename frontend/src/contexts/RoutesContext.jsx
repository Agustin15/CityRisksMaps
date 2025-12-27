import { createContext, useContext, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";

const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [showMenuRoutes, setShowMenuRoutes] = useState(false);
  const [destiny, setDestiny] = useState("");
  const [origin, setOrigin] = useState("");
  const [originLocation, setOriginLocation] = useState();
  const [destinyLocation, setDestinyLocation] = useState();
  const [transportSelected, setTransportSelected] = useState();
  const [routes, setRoutes] = useState();

  const handleClickRoute = (place) => {
    setShowMenuRoutes(true);
    setDestiny(place.formattedAddress);
    setDestinyLocation(place.location);
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
              "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
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
            languageCode: "sr-Latn"
          })
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error.message);

      setRoutes(result.routes);
    } catch (error) {
      alertSwalError(
        "Ups,rutas no encontradas",
        "Hubo un error al obtener las rutas"
      );
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
        transportSelected,
        routes,
        setRoutes,
        showRoutes
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = () => useContext(RoutesContext);
