import styles from "./Navigation.module.css";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useNavigation } from "../../../contexts/NavigationContext";
import { useEffect, useState } from "react";
import { ZoneInfo } from "./zoneInfo/ZoneInfo.jsx";
import { getImageManeuver } from "./functions.js";
import { HandleUserLocation } from "./HandleUserLocation.jsx";
import { useWindowResize } from "../../../contexts/WindowResizeContext.jsx";

export const Navigation = () => {
  const [warning, setWarning] = useState({
    rateLevel: "",
    rateColor: "",
    type: "",
    neighborhood: ""
  });

  const { windowWidth } = useWindowResize();
  const { handleCloseNavigation, currentStep } = useNavigation();

  return (
    <div>
      <HandleUserLocation warning={warning} setWarning={setWarning} />

      <MapControl
        position={
          windowWidth > 650
            ? ControlPosition.TOP_RIGHT
            : ControlPosition.TOP_CENTER
        }
      >
        <div className={styles.indication}>
          <div className={styles.maneuver}>
            <img
              src={getImageManeuver(currentStep.navigationInstruction.maneuver)}
            ></img>
          </div>
          <p>{currentStep.navigationInstruction.instructions}</p>
        </div>
      </MapControl>

      <div className={styles.detailsIndication}>
        <ZoneInfo warning={warning} />
        <button onClick={handleCloseNavigation}>X</button>

        <div className={styles.column}>
          <h4>{currentStep.localizedValues.staticDuration.text}</h4>
          <span>{currentStep.localizedValues.distance.text}</span>
        </div>
      </div>
    </div>
  );
};
