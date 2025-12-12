import styles from "./openingDays.module.css";
import iconClock from "../../../../assets/img/clock.png";
import iconArrow from "../../../../assets/img/arrow.png";
import { useState } from "react";
import { Weekdays } from "./weekdays";

export const OpeningDays = ({ place }) => {
  const [showOpeningDays, setShowOpeningDays] = useState(false);
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
    <li className={styles.detailOpeningHours}>
      <div className={styles.row}>
        <div className={styles.state}>
          <div className={styles.boxIcon}>
            <img className={styles.iconInfo} src={iconClock}></img>
          </div>
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

          {!showOpeningDays &&
            place.regularOpeningHours.periods[0].close &&
            (place.regularOpeningHours.nextCloseTime
              ? nextTime(place.regularOpeningHours.nextCloseTime, "Cierra")
              : nextTime(place.regularOpeningHours.nextOpenTime, "Abre"))}
        </div>
        <img
          onClick={() =>
            showOpeningDays
              ? setShowOpeningDays(false)
              : setShowOpeningDays(true)
          }
          className={
            !showOpeningDays
              ? styles.optionMenuDays
              : styles.openedOptionMenuDays
          }
          src={iconArrow}
        ></img>
      </div>

      {showOpeningDays && (
        <Weekdays periods={place.regularOpeningHours.periods} />
      )}
    </li>
  );
};
