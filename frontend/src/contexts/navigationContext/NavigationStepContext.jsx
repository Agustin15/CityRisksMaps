import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import {
  getUserCurrentStep,
  getIndexOfCoordinatesMostClosestToUser
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

  const map = useMap("mainMap");
  const { userLocation } = useMapControls();
  const { polygons } = useNeighborhoodsCrimes();
  const {
    recalculateRoute,
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

  const verifyUserDistanceToCurrentStep = () => {
    try {
      let toleranceGrades;

      if (
        transportSelected == "Drive" ||
        transportSelected == "Transit" ||
        transportSelected == "Two_wheeler"
      )
        toleranceGrades = 30 / 111319;
      else toleranceGrades = 15 / 111319;

      const coordinatesStep = google.maps.geometry.encoding.decodePath(
        currentStep.polyline.encodedPolyline
      );

      const userInStep = google.maps.geometry.poly.isLocationOnEdge(
        userLocation,
        new google.maps.Polyline({ path: coordinatesStep }),
        toleranceGrades
      );

      if (!userInStep) {
        recalculateRoute();
      } else {
        const indexLatLng = getIndexOfCoordinatesMostClosestToUser(
          polylineNavigation,
          userLocation
        );
        redrawRouteWhenUserMove(indexLatLng);
      }
    } catch (error) {
      return alertSwalError(
        "Ups algo salio mal durante la navegacion",
        error.message
      );
    }
  };

  const redrawRouteWhenUserMove = (indexLatLng) => {
    try {
      const newPolylinePath = polylineNavigation
        .getPath()
        .mh.filter((latLng, index) => {
          if (index >= indexLatLng) return latLng;
        });

      polylineNavigation.setOptions({ path: newPolylinePath });

      setPolylineNavigation(polylineNavigation);

      calculateCurrentUserStep(routeNavigation);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const calculateCurrentUserStep = (routeNavigation) => {
    let userStepFound = getUserCurrentStep(
      routeNavigation,
      userLocation,
      transportSelected
    );

    if (!userStepFound) throw new Error("Ups se ha deviado de la ruta actual");

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
        verifyUserDistanceToCurrentStep,
        verifyUserLocationInPolygon,
        warning
      }}
    >
      {children}
    </NavigationStepContext.Provider>
  );
};

export const useNavigationStep = () => useContext(NavigationStepContext);
