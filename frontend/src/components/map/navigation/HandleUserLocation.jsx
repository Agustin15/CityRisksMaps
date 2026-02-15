import { useEffect, useState } from "react";
import { useNavigation } from "../../../contexts/NavigationContext";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useMapControls } from "../../../contexts/MapContext";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext";
import {
  verifyUserDistanceToPolyline,
  verifyUserLocationInPolygon
} from "./functions.js";

export const HandleUserLocation = ({ warning, setWarning }) => {
  const [lastCheck, setLastCheck] = useState(
    new Date().setSeconds(new Date().getSeconds() - 5)
  );

  const { transportSelected } = useRoutes();
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();
  const { recalculateRoute, currentStep, redrawPolylineWhenUserMove } =
    useNavigation();

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

    const latLngIndex = verifyUserDistanceToPolyline(
      currentStep,
      userLocation,
      transportSelected
    );

    if (latLngIndex == null) {
      recalculateRoute();
    } else {
      redrawPolylineWhenUserMove(latLngIndex);
    }
  };
};
