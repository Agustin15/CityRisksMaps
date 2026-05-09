import { useEffect, useState } from "react";
import { useMapControls } from "../../../contexts/MapContext";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext";
import { useNavigationStep } from "../../../contexts/navigationContext/NavigationStepContext";
import { useNavigation } from "../../../contexts/navigationContext/NavigationContext";
import { useMap } from "@vis.gl/react-google-maps";

export const HandleUserLocation = () => {
  const [lastCheck, setLastCheck] = useState(
    new Date().setSeconds(new Date().getSeconds() - 6)
  );
  const { verifyUserLocationInPolygon, actionWhenUserLocationChange } =
    useNavigationStep();
  const { recalculateRoute } = useNavigation();
  const { transportSelected } = useRoutes();
  const { userLocation } = useMapControls();
  const map = useMap();

  useEffect(() => {
    let seconds = transportSelected == "Walk" ? 10 : 5;
    if ((new Date() - lastCheck) / 1000 < seconds) return;

    map.panTo(userLocation);
    map.setZoom(25);
    userLocationChanged();
  }, [userLocation]);

  const userLocationChanged = () => {
    setLastCheck(new Date());
    actionWhenUserLocationChange();
    verifyUserLocationInPolygon();
  };
};
