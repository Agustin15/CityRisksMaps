import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { getUserCurrentStep } from "./functionsNavigationStep.js";
import { alertSwalError } from "../../components/sweetAlert/sweetAlert.js";
import { useNavigation } from "./NavigationContext";
import { useMapControls } from "../MapContext";
import { useNeighborhoodsCrimes } from "../neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { useRoutes } from "../routesContext/RoutesContext";
import { useMap } from "@vis.gl/react-google-maps";

const NavigationStepContext = createContext();

export const NavigationStepProvider = ({ children }) => {
  const [warning, setWarning] = useState({
    rateLevel: "",
    rateColor: "",
    neighborhood: ""
  });

  const map = useMap("mainMap");
  const { userLocation } = useMapControls();
  const { polygons } = useNeighborhoodsCrimes();
  const {
    routeNavigation,
    setPolylineNavigation,
    polylineNavigation,
    setDestinationArrived,
    destinationArrived,
    currentStep,
    setCurrentStep,
    setIndexStep,
    indexStep
  } = useNavigation();

  const { transportSelected } = useRoutes();

  useEffect(() => {
    if (!routeNavigation) return;
    calculateCurrentUserStep(routeNavigation);
  }, [routeNavigation]);

  const verifyUserLocationInPolygon = () => {
    const polygonFound = polygons.find((polygon) => {
      if (google.maps.geometry.poly.containsLocation(userLocation, polygon))
        return polygon;
    });

    if (!polygonFound) {
      setWarning({ rateLevel: "", rateColor: "", neighborhood: "" });
    } else if (warning.neighborhood != polygonFound.data.name) {
      setWarning({
        ...warning,
        rateLevel: polygonFound.data.rateLevel,
        rateColor: polygonFound.data.rateColor,
        neighborhood: polygonFound.data.name
      });
    }
  };

  const calculateCurrentUserStep = (routeNavigation) => {
    let userStepFound = getUserCurrentStep(
      routeNavigation,
      userLocation,
      transportSelected
    );

    if (!userStepFound) return;

    if (userStepFound.index != indexStep || userStepFound.index == 0) {
      setIndexStep(userStepFound.index);
      setCurrentStep(userStepFound.step);

      let startLocation = userStepFound.step.startLocation.latLng;
      let endLocation = userStepFound.step.endLocation.latLng;

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

      if (routeNavigation.legs[0].steps.length == userStepFound.index + 1) {
        const distanceToDestination =
          google.maps.geometry.spherical.computeDistanceBetween(userLocation, {
            lat: endLocation.latitude,
            lng: endLocation.longitude
          });

        if (distanceToDestination < (transportSelected == "Walk" ? 15 : 10))
          setDestinationArrived(true);
        else if (destinationArrived == true) setDestinationArrived(false);
      }

      map.setHeading(heading);
    }
  };

  return (
    <NavigationStepContext.Provider
      value={{
        verifyUserLocationInPolygon,
        warning
      }}
    >
      {children}
    </NavigationStepContext.Provider>
  );
};

export const useNavigationStep = () => useContext(NavigationStepContext);
