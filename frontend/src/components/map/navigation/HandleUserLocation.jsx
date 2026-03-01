import { useEffect, useState } from "react";
import { useNavigation } from "../../../contexts/navigationContext/NavigationContext";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useMapControls } from "../../../contexts/MapContext";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext";
import {
  verifyUserDistanceToCurrentStep,
  verifyUserLocationInPolygon
} from "./functions.js";

export const HandleUserLocation = () => {
  const [lastCheck, setLastCheck] = useState(
    new Date().setSeconds(new Date().getSeconds() - 16)
  );

  const {
    recalculateRoute,
    currentStep,
    redrawRouteWhenUserMove,
    warning,
    setWarning
  } = useNavigation();
  
  const { transportSelected } = useRoutes();
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();

  useEffect(() => {
    switch (true) {
      case (transportSelected == "Drive" ||
        transportSelected == "Two_wheeler" ||
        transportSelected == "Transit") &&
        (new Date() - lastCheck) / 1000 > 4:
        userLocationChanged();
        break;

      case transportSelected == "Walk" && (new Date() - lastCheck) / 1000 > 15:
        userLocationChanged();
        break;
    }
  }, [userLocation]);

  const userLocationChanged = () => {
    setLastCheck(new Date());
    verifyUserLocationInPolygon(userLocation, polygons, setWarning, warning);

    const latLngIndex = verifyUserDistanceToCurrentStep(
      currentStep,
      userLocation,
      transportSelected
    );

    if (latLngIndex == null) {
      recalculateRoute();
    } else {
      redrawRouteWhenUserMove(latLngIndex);
    }
  };
};
