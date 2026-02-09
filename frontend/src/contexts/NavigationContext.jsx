import { useContext } from "react";
import { createContext, useState } from "react";
import { useRoutes } from "./routesContext/RoutesContext";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapControls } from "./MapContext";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const map = useMap();
  const [routeNavigation, setRouteNavigation] = useState();
  const { userLocation } = useMapControls();
  const {
    routes,
    routeSelected,
    polylines,
    setPolylines,
    polylinesBackground,
    setPolylinesBackground,
    setShowMenuRoutes
  } = useRoutes();

  const handleNavigation = () => {
    const polylinesUpdated = polylines.filter((polyline, index) => {
      if (index != routeSelected) polyline.setMap(null);
      else return polyline;
    });

    polylinesBackground.map((polyline) => polyline.setMap(null));

    setPolylines(polylinesUpdated);
    setPolylinesBackground();

    const route = routes.find((route, index) => index == routeSelected);

    setRouteNavigation(route);
    map.setOptions({
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      center: userLocation,
      zoom: 20
    });

    const startLocation = route.legs[0].steps[0].startLocation.latLng;
    const endLocation = route.legs[0].steps[0].endLocation.latLng;

    const heading = google.maps.geometry.spherical.computeHeading(
      { lat: startLocation.latitude, lng: startLocation.longitude },
      { lat: endLocation.latitude, lng: endLocation.longitude }
    );

    map.setTilt(80);
    map.setHeading(heading);
    setShowMenuRoutes(false);
  };

  const handleCloseNavigation = () => {
    setRouteNavigation();
    map.setOptions({
      disableDefaultUI: true,
      zoomControl: true,
      streetViewControl: true,
      center: userLocation,
      zoom: 15
    });
  };

  return (
    <NavigationContext.Provider
      value={{
        routeNavigation,
        setRouteNavigation,
        handleNavigation,
        handleCloseNavigation
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
