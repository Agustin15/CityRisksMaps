import styles from "./openingDays.module.css";
import iconClock from "../../../../assets/img/clock.png";
import iconArrow from "../../../../assets/img/arrow.png";
import { useState } from "react";
import { Weekdays } from "./weekdays";

export const OpeningDays = ({ getDay, place }) => {
  const [showOpeningDays, setShowOpeningDays] = useState(false);

  const nextOpeningPeriod = (openingHours) => {
    const currentDate = new Date();
    const listNextSevendays = [];

    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);

    let cont = 1;
    while (cont <= 7) {
      let dayMillseconds = currentDate.getTime() + 60 * 60 * 24 * 1000 * cont;

      listNextSevendays.push(new Date(dayMillseconds));

      cont++;
    }

    for (let day of listNextSevendays) {
      const nextOpening = openingHours.periods.find((period) => {
        if (period.open.day == day.getDay()) return period;
      });

      if (nextOpening) return nextOpening.open;
    }
  };

  const nextPeriod = (openingHours, isOpen) => {
    const period = openingHours.periods.find((period) => {
      if (isOpen && period.open.day == new Date().getDay()) return period;
    });

    if (isOpen) {
      return (
        "Cierra a las " +
        (period.close.hour < 10 ? "0" + period.close.hour : period.close.hour) +
        ":" +
        (period.close.minute < 10
          ? "0" + period.close.minute
          : period.close.minute)
      );
    } else {
      let nextOpening = nextOpeningPeriod(openingHours);

      return (
        "Abre a las " +
        (nextOpening.hour < 10 ? "0" + nextOpening.hour : nextOpening.hour) +
        ":" +
        (nextOpening.minute < 10
          ? "0" + nextOpening.minute
          : nextOpening.minute) +
        " del " +
        getDay(nextOpening.day)
      );
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
            nextPeriod(
              place.regularOpeningHours,
              place.regularOpeningHours.openNow
            )}
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
