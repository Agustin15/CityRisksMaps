import styles from "./OpeningDays.module.css";

export const DaysOpenState = ({ periods, days, listWeekdaysOpen }) => {
  const createString = (weekday) => {
    return (
      (weekday.period.open.hour < 10
        ? "0" + weekday.period.open.hour
        : weekday.period.open.hour) +
      ":" +
      (weekday.period.open.minute < 10
        ? "0" + weekday.period.open.minute
        : weekday.period.open.minute) +
      " - " +
      (weekday.period.close.hours < 10
        ? "0" + weekday.period.close.hour
        : weekday.period.close.hour) +
      ":" +
      (weekday.period.close.minute < 10
        ? "0" + weekday.period.close.minute
        : weekday.period.close.minute)
    );
  };

  return !periods[0].close
    ? days.map((day, index) => (
        <li key={index}>
          <span
            className={
              days.indexOf(day) == new Date().getDay() ? styles.today : ""
            }
          >
            {day}
          </span>
          <span
            className={
              days.indexOf(day) == new Date().getDay() ? styles.today : ""
            }
          >
            Abierto 24 horas
          </span>
        </li>
      ))
    : listWeekdaysOpen().map((weekday, index) => (
        <li key={index}>
          <span
            className={
              days.indexOf(weekday.day) == new Date().getDay()
                ? styles.today
                : ""
            }
          >
            {weekday.day}
          </span>

          {weekday.period ? (
            <span
              className={
                weekday.period.open.day == new Date().getDay()
                  ? styles.today
                  : ""
              }
            >
              {createString(weekday)}
            </span>
          ) : (
            <span
              className={
                days.indexOf(weekday.day) == new Date().getDay()
                  ? styles.today
                  : ""
              }
            >
              Cerrado
            </span>
          )}
        </li>
      ));
};
