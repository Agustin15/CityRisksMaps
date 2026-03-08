import { useContext } from "react";
import { createContext, useState } from "react";
import { useRoutes } from "../routesContext/RoutesContext";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapControls } from "../MapContext";
import { getNewRoute, getUserStep } from "./functions.js";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const map = useMap();
  const [routeNavigation, setRouteNavigation] = useState();
  const [polylineNavigation, setPolylineNavigation] = useState();
  const [currentStep, setCurrentStep] = useState();
  const [indexStep, setIndexStep] = useState(0);
  const [destinationArrived, setDestinationArrived] = useState(false);
  const [activeNavigationVoice, setActiveNavigationVoice] = useState(false);
  const [editRoute, setEditRoute] = useState(false);
  const [warning, setWarning] = useState({
    rateLevel: "",
    rateColor: "",
    type: "",
    neighborhood: ""
  });

  const { userLocation } = useMapControls();
  const {
    routes,
    routeSelected,
    setRouteSelected,
    setRoutes,
    polylines,
    setPolylines,
    setShowMenuRoutes,
    destinationLocation,
    transportSelected
  } = useRoutes();

  const handleNavigation = () => {
    const polylineFound = polylines.filter((polyline, index) => {
      if (index != routeSelected) polyline.setMap(null);
      else return polyline;
    });

    const routeFound = routes.find((route, index) => index == routeSelected);

    map.setOptions({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: false,
      streetViewControl: false,
      center: userLocation,
      zoom: 20
    });

    const startLocation = routeFound.legs[0].steps[0].startLocation.latLng;
    const endLocation = routeFound.legs[0].steps[0].endLocation.latLng;

    const heading = google.maps.geometry.spherical.computeHeading(
      { lat: startLocation.latitude, lng: startLocation.longitude },
      { lat: endLocation.latitude, lng: endLocation.longitude }
    );

    map.setTilt(100);
    map.setHeading(heading);

    setPolylines();
    setRoutes();
    setRouteSelected();
    setShowMenuRoutes(false);

    setPolylineNavigation(polylineFound[0]);
    setRouteNavigation(routeFound);
    setCurrentStep(routeFound.legs[0].steps[0]);
    setIndexStep(0);
  };

  const handleCloseNavigation = () => {
    polylineNavigation.setMap(null);
    setPolylineNavigation();
    setRouteNavigation();
    setEditRoute(false);

    if (activeNavigationVoice) setActiveNavigationVoice(false);

    if (destinationArrived == true) setDestinationArrived(false);

    google.maps.event.clearListeners(map, "click");

    map.setOptions({
      disableDefaultUI: true,
      clickableIcons: true,
      zoomControl: true,
      streetViewControl: true,
      draggableCursor: "auto",
      center: userLocation,
      zoom: 15
    });
  };

  const recalculateRoute = async (intermediates) => {
    let originLocation = {
      latitude: userLocation.lat,
      longitude: userLocation.lng
    };

    const result = await getNewRoute(
      originLocation,
      transportSelected,
      destinationLocation,
      intermediates
    );

    if (result && result.routes) {
      const newRoute = result.routes[0];
      const pathRoute = new google.maps.geometry.encoding.decodePath(
        newRoute.polyline.encodedPolyline
      );

      polylineNavigation.setOptions({
        path: pathRoute
      });

      setRouteNavigation(newRoute);
      setPolylineNavigation(polylineNavigation);
    }
  };

  const redrawRouteWhenUserMove = (indexLatLng) => {
    const newPolylinePath = polylineNavigation
      .getPath()
      .mh.filter((latLng, index) => {
        if (index >= indexLatLng) return latLng;
      });

    polylineNavigation.setOptions({ path: newPolylinePath });

    setPolylineNavigation(polylineNavigation);

    calculateUserStep();
  };

  const calculateUserStep = () => {
    let userStepFound = getUserStep(
      routeNavigation,
      userLocation,
      transportSelected
    );

    if (userStepFound.stepFound && userStepFound.indexStepFound != indexStep) {
      let startLocation = userStepFound.stepFound.startLocation.latLng;
      let endLocation = userStepFound.stepFound.endLocation.latLng;

      const heading = google.maps.geometry.spherical.computeHeading(
        {
          lat: startLocation.latitude,
          lng: startLocation.longitude
        },
        {
          lat: endLocation.latitude,
          lng: endLocation.longitude
        }
      );

      if (
        routeNavigation.legs[0].steps.length ==
        userStepFound.indexStepFound + 1
      ) {
        if (
          google.maps.geometry.spherical.computeDistanceBetween(
            userLocation,
            endLocation
          ) < (transportSelected == "Walk" ? 15 : 10)
        )
          setDestinationArrived(true);
        else if (destinationArrived == true) setDestinationArrived(false);
      }

      map.setHeading(heading);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        routeNavigation,
        polylineNavigation,
        currentStep,
        setPolylineNavigation,
        recalculateRoute,
        redrawRouteWhenUserMove,
        handleNavigation,
        activeNavigationVoice,
        setActiveNavigationVoice,
        destinationArrived,
        warning,
        setWarning,
        editRoute,
        setEditRoute,
        handleCloseNavigation
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
