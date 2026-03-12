import styles from "./MenuOptions.module.css";
import iconDisableVoice from "../../../../../assets/img/disableVoice.png";
import iconEnableVoice from "../../../../../assets/img/enableVoice.png";
import iconEditRoute from "../../../../../assets/img/editRoute.png";
import iconNoEditRoute from "../../../../../assets/img/noEditRoute.png";
import { useNavigation } from "../../../../../contexts/navigationContext/NavigationContext";
import { useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { ZoneInfo } from "./zoneInfo/ZoneInfo.jsx";
import { handleOptionVoice } from "../../functions.js";
import { handleEditRoute } from "./functions.js";


export const MenuOptions = () => {
  const {
    setActiveNavigationVoice,
    activeNavigationVoice,
    currentStep,
    recalculateRoute,
    editRoute,
    setEditRoute
  } = useNavigation();

 const map = useMap()
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

      <button
        onClick={() =>
          handleEditRoute(map, editRoute, setEditRoute, recalculateRoute)
        }
        className={styles.iconEditRoute}
        title="Editar ruta"
      >
        <img src={!editRoute ? iconEditRoute : iconNoEditRoute}></img>
      </button>

      <ZoneInfo svgWarningRef={svgWarningRef} />
    </div>
  );
};
