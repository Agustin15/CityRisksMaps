import styles from "./Navigation.module.css";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useNavigation } from "../../../contexts/NavigationContext";
import { useZoneCrimes } from "../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useMapControls } from "../../../contexts/MapContext.jsx";
import { useEffect, useState } from "react";
import { ZoneInfo } from "./zoneInfo/ZoneInfo.jsx";
import {
  convertDuration,
  convertDistance
} from "../menuRoute/routesCalculated/functions.js";
import { getImageManeuver, verifyUserLocationInPolygon } from "./functions.js";

export const Navigation = () => {
  const { routeNavigation, handleCloseNavigation } = useNavigation();
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();
  const [warning, setWarning] = useState({
    rateLevel: "",
    rateColor: "",
    type: "",
    neighborhood: ""
  });

  useEffect(() => {
    verifyUserLocationInPolygon(userLocation, polygons, setWarning, warning);
  }, [userLocation]);

  return (
    <div>
      <MapControl position={ControlPosition.TOP_RIGHT}>
        <div className={styles.indication}>
          <div className={styles.maneuver}>
            <img
              src={getImageManeuver(
                routeNavigation.legs[0].steps[0].navigationInstruction.maneuver
              )}
            ></img>
          </div>
          <p>
            {
              routeNavigation.legs[0].steps[0].navigationInstruction
                .instructions
            }
          </p>
        </div>
      </MapControl>

      <div className={styles.detailsIndication}>
        <ZoneInfo warning={warning} />
        <button onClick={handleCloseNavigation}>X</button>

        <div className={styles.column}>
          <h4>
            {convertDuration(
              parseInt(routeNavigation.legs[0].steps[0].staticDuration)
            )}
          </h4>
          <span>
            {convertDistance(
              parseInt(routeNavigation.legs[0].steps[0].distanceMeters)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
