import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import {
  getUserCurrentStep,
  getNextCoordinatesToUserLocation,
  coordinateMostCloseToUserLocation
} from "./functionsNavigationStep.js";
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

  const [lastLatLngMostClose, setLastLatLngMostClose] = useState(null);

  const map = useMap("mainMap");
  const { userLocation } = useMapControls();
  const { polygons } = useNeighborhoodsCrimes();
  const {
    routeNavigation,
    recalculateRoute,
    setPolylineNavigation,
    polylineNavigation,
    polylineBackground,
    setDestinationArrived,
    destinationArrived,
    currentStep,
    setCurrentStep,
    setIndexStep,
    indexStep,
    intermediates
  } = useNavigation();

  const { transportSelected } = useRoutes();

  useEffect(() => {
    if (!routeNavigation) return;
    redrawPolylineNavigation(routeNavigation);
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

  const actionWhenUserLocationChange = async () => {
    let toleranceGrades;

    const polylineCurrentStep = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(
        currentStep.polyline.encodedPolyline
      )
    });

    if (
      transportSelected == "Drive" ||
      transportSelected == "Transit" ||
      transportSelected == "Two_wheeler"
    )
      toleranceGrades = 15 / 111319;
    else toleranceGrades = 10 / 111319;

    const isOnEdge = google.maps.geometry.poly.isLocationOnEdge(
      userLocation,
      polylineCurrentStep,
      toleranceGrades
    );
    if (!isOnEdge) {
      await recalculateRoute(intermediates);
    } else {
      redrawPolylineNavigation(routeNavigation);
    }
  };

  const redrawPolylineNavigation = (routeNavigation) => {
    const currentStep = calculateCurrentUserStep(routeNavigation);

    if (!currentStep) return;

    const polylineStep = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(
        currentStep.step.polyline.encodedPolyline
      )
    });

    let path = polylineStep.getPath().getArray();

    let nextCoordinates = getNextCoordinatesToUserLocation(
      path,
      userLocation,
      map
    );

    if (nextCoordinates.length == 0) return;

    const latLngMostCloseToUserLocation = coordinateMostCloseToUserLocation(
      nextCoordinates,
      userLocation
    );

    let pathNavigation = polylineNavigation.getPath().getArray();

    pathNavigation = pathNavigation.slice(
      pathNavigation.findIndex((latLng) =>
        latLng.equals(latLngMostCloseToUserLocation)
      )
    );

    pathNavigation.unshift(userLocation);
    polylineBackground.setPath(pathNavigation);
    polylineNavigation.setPath(pathNavigation);
  };

  const calculateCurrentUserStep = (routeNavigation) => {
    let userStepFound = getUserCurrentStep(routeNavigation, userLocation);

    if (!userStepFound) return;
    let endLocationStep = userStepFound.step.endLocation.latLng;

    if (userStepFound.index != indexStep || userStepFound.index == 0) {
      setIndexStep(userStepFound.index);
      setCurrentStep(userStepFound.step);

      const heading = google.maps.geometry.spherical.computeHeading(
        userLocation,
        {
          lat: endLocationStep.latitude,
          lng: endLocationStep.longitude
        }
      );

      map.setHeading(heading);
    }
    verifyUserArrivedToDestination(userStepFound, endLocationStep);

    return userStepFound;
  };

  const verifyUserArrivedToDestination = (userStepFound, endLocationStep) => {
    if (routeNavigation.legs[0].steps.length == userStepFound.index + 1) {
      const distanceToDestination =
        google.maps.geometry.spherical.computeDistanceBetween(userLocation, {
          lat: endLocationStep.latitude,
          lng: endLocationStep.longitude
        });

      if (distanceToDestination < (transportSelected == "Walk" ? 15 : 10))
        setDestinationArrived(true);
      else if (destinationArrived == true) setDestinationArrived(false);
    }
  };
  return (
    <NavigationStepContext.Provider
      value={{
        verifyUserLocationInPolygon,
        actionWhenUserLocationChange,
        warning
      }}
    >
      {children}
    </NavigationStepContext.Provider>
  );
};

export const useNavigationStep = () => useContext(NavigationStepContext);
