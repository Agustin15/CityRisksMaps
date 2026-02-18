import styles from "./Navigation.module.css";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useNavigation } from "../../../contexts/NavigationContext";
import { useWindowResize } from "../../../contexts/WindowResizeContext.jsx";
import { useEffect, useState } from "react";
import { HandleUserLocation } from "./HandleUserLocation.jsx";
import { activateNavigationVoice, getImageManeuver } from "./functions.js";
import { DetailsIndication } from "./detailsIndication/DetailsIndication.jsx";

export const Navigation = () => {
  const [warning, setWarning] = useState({
    rateLevel: "",
    rateColor: "",
    type: "",
    neighborhood: ""
  });
  const { windowWidth } = useWindowResize();
  const { destinationArrived, currentStep, activeNavigationVoice } =
    useNavigation();

  useEffect(() => {
    if (!currentStep || !activeNavigationVoice) return;
    let text = currentStep.navigationInstruction.instructions;
    if (destinationArrived == true) text = "¡Ha llegado a su destino!";

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

      <DetailsIndication currentStep={currentStep} warning={warning} />
    </div>
  );
};
