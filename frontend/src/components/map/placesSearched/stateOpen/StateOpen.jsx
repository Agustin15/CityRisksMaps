import styles from "./StateOpen.module.css";

export const StateOpen = ({ place }) => {
  return (
    <div className={styles.stateOpen}>
      <span
        className={
          place.regularOpeningHours.openNow ? styles.open : styles.close
        }
      >
        {place.regularOpeningHours.openNow
          ? !place.regularOpeningHours.periods[0].close
            ? "Abierto 24 horas"
            : "Abierto"
          : "Cerrado"}
      </span>
    </div>
  );
};
