const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { useRoutes } from "./routesContext/RoutesContext";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapControls } from "./MapContext";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const map = useMap();
  const [routeNavigation, setRouteNavigation] = useState();
  const [polylineNavigation, setPolylineNavigation] = useState();
  const [currentStep, setCurrentStep] = useState();
  const [indexStep, setIndexStep] = useState(0);

  const { userLocation } = useMapControls();
  const {
    routes,
    routeSelected,
    setRouteSelected,
    setRoutes,
    polylines,
    setPolylines,
    polylinesBackground,
    setPolylinesBackground,
    setShowMenuRoutes,
    destinationLocation,
    transportSelected
  } = useRoutes();

  const handleNavigation = () => {
    polylinesBackground.map((polyline) => polyline.setMap(null));

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

    setPolylinesBackground();
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

    map.setOptions({
      disableDefaultUI: true,
      clickableIcons: true,
      zoomControl: true,
      streetViewControl: true,
      center: userLocation,
      zoom: 15
    });
  };

  const recalculateRoute = async () => {
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
              location: { latLng: userLocation }
            },
            destination: {
              location: { latLng: destinationLocation }
            },
            travelMode: transportSelected,
            computeAlternativeRoutes: false,
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

      if (result.routes) {
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
    } catch (error) {
      console.log(error);
    }
  };

  const redrawPolylineWhenUserMove = (indexLatLng) => {
    const newPolylinePath = polylineNavigation
      .getPath()
      .mh.filter((latLng, index) => {
        if (index >= indexLatLng) return latLng;
      });

    let polylineNavigationCopy = { ...polylineNavigation };
    polylineNavigationCopy.setOptions({ path: newPolylinePath });

    setPolylineNavigation(polylineNavigationCopy);

    calculateNextStep();
  };

  const calculateNextStep = () => {
    let startLocation = currentStep.startLocation.latLng;
    let endLocation = currentStep.endLocation.latLng;

    const distanceToEndStep =
      google.maps.geometry.spherical.computeDistanceBetween(userLocation, {
        lat: endLocation.latitude,
        lng: endLocation.longitude
      });

    if (
      ((transportSelected == "Drive" ||
        transportSelected == "Transit" ||
        transportSelected == "Two_wheeler") &&
        distanceToEndStep < 10) ||
      (transportSelected == "Walk" && distanceToEndStep <= 1)
    ) {
      const newIndexStep = indexStep + 1;
      setCurrentStep(routeNavigation.legs[0].steps[newIndexStep]);
      setIndexStep(newIndexStep);

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

      map.setHeading(heading);
    } else return;
  };

  return (
    <NavigationContext.Provider
      value={{
        routeNavigation,
        polylineNavigation,
        currentStep,
        setPolylineNavigation,
        recalculateRoute,
        redrawPolylineWhenUserMove,
        handleNavigation,
        handleCloseNavigation
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
