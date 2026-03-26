import { useEffect, useState } from "react";
import { useMapControls } from "../../../contexts/MapContext";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext";
import { useNavigationStep } from "../../../contexts/navigationContext/NavigationStepContext";

export const HandleUserLocation = () => {
  const [lastCheck, setLastCheck] = useState(
    new Date().setSeconds(new Date().getSeconds() - 16)
  );

  const { verifyUserDistanceToCurrentStep, verifyUserLocationInPolygon } =
    useNavigationStep();

  const { transportSelected } = useRoutes();
  const { userLocation } = useMapControls();

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
    verifyUserLocationInPolygon();
    verifyUserDistanceToCurrentStep();
  };
};
