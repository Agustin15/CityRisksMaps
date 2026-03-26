import styles from "./MenuOptions.module.css";
import iconDisableVoice from "../../../../../assets/img/disableVoice.png";
import iconEnableVoice from "../../../../../assets/img/enableVoice.png";
import { useNavigation } from "../../../../../contexts/navigationContext/NavigationContext";
import { useRef } from "react";
import { ZoneInfo } from "./zoneInfo/ZoneInfo.jsx";
import { EditRoute } from "./editRoute/EditRoute.jsx";

export const MenuOptions = () => {
  const { activeNavigationVoice, handleOptionVoice } = useNavigation();

  const svgWarningRef = useRef();

  return (
    <div className={styles.menuOptions}>
      <button onClick={() => handleOptionVoice()}>
        <img
          src={activeNavigationVoice ? iconEnableVoice : iconDisableVoice}
        ></img>
      </button>

      <EditRoute />

      <ZoneInfo svgWarningRef={svgWarningRef} />
    </div>
  );
};
