import styles from "./DetailsIndication.module.css";

export const DetailsIndication = ({ currentStep }) => {
  return (
    <div className={styles.containDetailsIndication}>
      <div className={styles.detailsIndication}>
        <span>
          <a>Duracion: </a>
          {currentStep.localizedValues.staticDuration.text}
        </span>
        <span>
          <a>Distancia: </a>
          {currentStep.localizedValues.distance.text}
        </span>
      </div>
    </div>
  );
};
