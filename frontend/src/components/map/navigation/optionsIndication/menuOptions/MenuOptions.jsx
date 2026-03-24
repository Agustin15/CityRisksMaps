import styles from "./MenuOptions.module.css";
import iconDisableVoice from "../../../../../assets/img/disableVoice.png";
import iconEnableVoice from "../../../../../assets/img/enableVoice.png";
import { useNavigation } from "../../../../../contexts/navigationContext/NavigationContext";
import { useRef } from "react";
import { ZoneInfo } from "./zoneInfo/ZoneInfo.jsx";
import { handleOptionVoice } from "../../functions.js";
import { EditRoute } from "./editRoute/EditRoute.jsx";

export const MenuOptions = () => {
  const { setActiveNavigationVoice, activeNavigationVoice, currentStep } =
    useNavigation();

  const svgWarningRef = useRef();

  return (
    <div className={styles.menuOptions}>
      <button
        onClick={() =>
          handleOptionVoice(
            activeNavigationVoice,
            setActiveNavigationVoice,
            currentStep
          )
        }
      >
        <img
          src={activeNavigationVoice ? iconEnableVoice : iconDisableVoice}
        ></img>
      </button>

      <EditRoute />

      <ZoneInfo svgWarningRef={svgWarningRef} />
    </div>
  );
};
