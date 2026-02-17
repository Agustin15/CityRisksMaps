import styles from "./Navigation.module.css";
import iconDisableVoice from "../../../assets/img/disableVoice.png";
import iconEnableVoice from "../../../assets/img/enableVoice.png";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useNavigation } from "../../../contexts/NavigationContext";
import { useEffect, useState } from "react";
import { ZoneInfo } from "./zoneInfo/ZoneInfo.jsx";
import {
  handleOptionVoice,
  activateNavigationVoice,
  getImageManeuver
} from "./functions.js";
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
  const {
    handleCloseNavigation,
    destinationArrived,
    currentStep,
    activeNavigationVoice,
    setActiveNavigationVoice
  } = useNavigation();

  useEffect(() => {
    if (!currentStep || !activeNavigationVoice) return;
    let msj = currentStep.navigationInstruction.instructions;
    if (destinationArrived == true) msj = "¡Ha llegado a su destino!";

    activateNavigationVoice(msj);
  }, [currentStep]);

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
          <p>
            {destinationArrived == true
              ? "¡Ha llegado a su destino!"
              : currentStep.navigationInstruction.instructions}
          </p>
        </div>
      </MapControl>

      <div className={styles.detailsIndication}>
        <ZoneInfo warning={warning} />
        <button className={styles.btnClose} onClick={handleCloseNavigation}>
          X
        </button>

        <div className={styles.column}>
          <h4>{currentStep.localizedValues.staticDuration.text}</h4>
          <span>{currentStep.localizedValues.distance.text}</span>
        </div>

        <button
          onClick={() =>
            handleOptionVoice(
              activeNavigationVoice,
              setActiveNavigationVoice,
              currentStep
            )
          }
          className={styles.btnVoice}
        >
          <img
            src={activeNavigationVoice ? iconEnableVoice : iconDisableVoice}
          ></img>
        </button>
      </div>
    </div>
  );
};
