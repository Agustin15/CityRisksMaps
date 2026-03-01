import styles from "./DetailsIndication.module.css";
import { useNavigation } from "../../../../../contexts/navigationContext/NavigationContext";

export const DetailsIndication = ({ currentStep }) => {
  const { handleCloseNavigation } = useNavigation();

  return (
    <div className={styles.detailsIndication}>
      <button onClick={() => handleCloseNavigation()}></button>
      <span>
        <a>Duracion: </a>
        {currentStep.localizedValues.staticDuration.text}
      </span>
      <span>
        <a>Distancia: </a>
        {currentStep.localizedValues.distance.text}
      </span>
    </div>
  );
};
