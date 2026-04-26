import styles from "./MenuOptions.module.css";
import iconDisableVoice from "../../../../../assets/img/disableVoice.png";
import iconEnableVoice from "../../../../../assets/img/enableVoice.png";
import iconExitNavigation from "../../../../../assets/img/exitNavigation.png";
import { useNavigation } from "../../../../../contexts/navigationContext/NavigationContext";
import { useNavigationStep } from "../../../../../contexts/navigationContext/NavigationStepContext.jsx";
import { useRef } from "react";
import { ZoneInfo } from "./zoneInfo/ZoneInfo.jsx";
import { EditRoute } from "./editRoute/EditRoute.jsx";

export const MenuOptions = () => {
  const { activeNavigationVoice, handleOptionVoice, handleCloseNavigation } =
    useNavigation();
  const { warning } = useNavigationStep();

  const svgWarningRef = useRef();

  return (
    <div className={styles.menuOptions}>
      <div className={styles.containBtn}>
        <button onClick={() => handleOptionVoice()}>
          <img
            src={activeNavigationVoice ? iconEnableVoice : iconDisableVoice}
          ></img>
        </button>
      </div>
      <EditRoute />

      {warning.neighborhood.length > 0 && (
        <ZoneInfo svgWarningRef={svgWarningRef} />
      )}

      <div className={styles.containBtn}>
        <button className={styles.exit} onClick={() => handleCloseNavigation()}>
          <img src={iconExitNavigation}></img>
        </button>
      </div>
    </div>
  );
};
