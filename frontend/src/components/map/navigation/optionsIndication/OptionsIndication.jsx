import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import styles from "./OptionsIndication.module.css";
import iconDisableVoice from "../../../../assets/img/disableVoice.png";
import iconEnableVoice from "../../../../assets/img/enableVoice.png";
import { useNavigation } from "../../../../contexts/navigationContext/NavigationContext";
import { useRef } from "react";
import { ZoneInfo } from "../zoneInfo/ZoneInfo";
import { DetailsIndication } from "./detailsIndication/DetailsIndication.jsx";
import { handleOptionVoice } from "../functions.js";


export const OptionsIndication = () => {
  const {
    setActiveNavigationVoice,
    activeNavigationVoice,
    warning,
    currentStep
  } = useNavigation();

  const svgWarningRef = useRef();

  return (
    <div>
      {svgWarningRef.current && (
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
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
        </MapControl>
      )}

      {warning.neighborhood.length > 0 && (
        <ZoneInfo svgWarningRef={svgWarningRef} />
      )}

      <MapControl position={ControlPosition.BOTTOM_CENTER}>
        <DetailsIndication currentStep={currentStep} />
      </MapControl>
    </div>
  );
};
