import styles from "./Navigation.module.css";
import { useNavigation } from "../../../contexts/navigationContext/NavigationContext";
import { useWindowResize } from "../../../contexts/WindowResizeContext.jsx";
import { useEffect } from "react";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { HandleUserLocation } from "./HandleUserLocation.jsx";
import { OptionsIndication } from "./optionsIndication/OptionsIndication.jsx";
import { getImageManeuver } from "./functions.js";
import { useNavigationStep } from "../../../contexts/navigationContext/NavigationStepContext.jsx";

export const Navigation = () => {
  const {
    destinationArrived,
    currentStep,
    activeNavigationVoice,
    activateNavigationVoice
  } = useNavigation();

  const { warning } = useNavigationStep();

  const { windowWidth } = useWindowResize();

  useEffect(() => {
    if (!currentStep || !activeNavigationVoice) return;
    let text =
      destinationArrived == true
        ? "¡Ha llegado a su destino!"
        : currentStep.navigationInstruction.instructions;

    activateNavigationVoice(text);
  }, [currentStep]);

  useEffect(() => {
    if (warning.neighborhood.length == 0 || !activeNavigationVoice) return;

    let text = `Entrando a barrio ${warning.neighborhood} el cual tiene una
        ${warning.type == "crime" ? " tasa de homicidio " : " percepcion de seguridad "}
        ${warning.rateLevel}`;

    activateNavigationVoice(text);
  }, [warning]);

  return (
    <div>
      <HandleUserLocation />

      <MapControl
        position={
          windowWidth <= 650
            ? ControlPosition.TOP_CENTER
            : windowWidth > 650 && windowWidth < 1200
              ? ControlPosition.TOP_LEFT
              : ControlPosition.TOP_RIGHT
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

      <OptionsIndication />
    </div>
  );
};
