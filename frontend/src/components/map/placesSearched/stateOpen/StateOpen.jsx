import styles from "./StateOpen.module.css";

export const StateOpen = ({ place }) => {
  const formatHourAndMinutes = (nextTime) => {
    const nextTimeDate = new Date(nextTime);

    const hours = nextTimeDate.getHours();
    const minutes = nextTimeDate.getMinutes();

    return (
      (hours < 10 ? "0" + hours : hours) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes)
    );
  };

  const nextTime = (nextTime, option) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado"
    ];

    if (
      new Date(nextTime).getDay() == new Date().getDay() &&
      new Date(nextTime).getTime() - new Date().getTime() < 3600 * 24 * 1000
    ) {
      return `${option} a las ${formatHourAndMinutes(nextTime)}`;
    } else {
      const weekday = new Date(nextTime).getDay();
      return `${option} el ${days[weekday]} a las ${formatHourAndMinutes(
        nextTime
      )}`;
    }
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
        {place.regularOpeningHours.nextCloseTime
          ? nextTime(place.regularOpeningHours.nextCloseTime, "- Cierra")
          : nextTime(place.regularOpeningHours.nextOpenTime, "- Abre")}
      </span>
    </div>
  );
};
