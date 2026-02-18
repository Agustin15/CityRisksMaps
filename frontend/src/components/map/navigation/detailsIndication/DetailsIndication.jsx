import styles from "./DetailsIndication.module.css";
import iconDisableVoice from "../../../../assets/img/disableVoice.png";
import iconEnableVoice from "../../../../assets/img/enableVoice.png";
import { useNavigation } from "../../../../contexts/NavigationContext";
import { ZoneInfo } from "../zoneInfo/ZoneInfo";
import { handleOptionVoice } from "../functions.js";

export const DetailsIndication = ({ currentStep, warning }) => {
  const {
    handleCloseNavigation,
    setActiveNavigationVoice,
    activeNavigationVoice
  } = useNavigation();

  return (
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
  );
};
