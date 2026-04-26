import { useEffect, useState } from "react";
import { useMapControls } from "../../../contexts/MapContext";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext";
import { useNavigationStep } from "../../../contexts/navigationContext/NavigationStepContext";

export const HandleUserLocation = () => {
  const [lastCheck, setLastCheck] = useState(
    new Date().setSeconds(new Date().getSeconds() - 6)
  );

  const { verifyUserDistanceToCurrentStep, verifyUserLocationInPolygon } =
    useNavigationStep();

  const { transportSelected } = useRoutes();
  const { userLocation } = useMapControls();

  useEffect(() => {
    if ((new Date() - lastCheck) / 1000 < 4) return;

    userLocationChanged();
  }, [userLocation]);

  const userLocationChanged = () => {
    verifyUserLocationInPolygon();
    verifyUserDistanceToCurrentStep();
  };
};
