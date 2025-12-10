import styles from "./StateOpen.module.css";

export const StateOpen = ({ place }) => {
  const formatHourAndMinutes = (nextCloseTime) => {
    const hours = nextCloseTime.getHours();
    const minutes = nextCloseTime.getMinutes();

    return (
      (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes)
    );
  };
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
      <span>
        {place.regularOpeningHours.nextCloseTime &&
          "- Cierra a las " +
            formatHourAndMinutes(
              new Date(place.regularOpeningHours.nextCloseTime)
            )}
      </span>
    </div>
  );
};
