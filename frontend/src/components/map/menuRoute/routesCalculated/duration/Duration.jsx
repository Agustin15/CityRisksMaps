import styles from "./Duration.module.css";

export const Duration = ({ route }) => {
  return (
    <div className={styles.columnTwo}>
      <span className={styles.duration}>
        {route.legs[0].localizedValues.staticDuration.text}
      </span>
      {route.legs[0].localizedValues.distance.text}
    </div>
  );
};
