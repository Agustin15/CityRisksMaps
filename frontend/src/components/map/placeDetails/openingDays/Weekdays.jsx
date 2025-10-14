import styles from "./OpeningDays.module.css";
import { DaysOpenState } from "./DaysOpenState";

export const Weekdays = ({ periods }) => {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
  ];

  const listWeekdaysOpen = () => {
    const weekdaysStateOpen = [];

    for (let f = 0; f < days.length; f++) {
      let period = periods.find((period) => period.open.day == f);
      if (period) {
        weekdaysStateOpen.push({ day: days[f], period: period });
      } else weekdaysStateOpen.push({ day: days[f], state: "Cerrado" });
    }

    return weekdaysStateOpen;
  };

  return (
    <ul className={styles.listOpeningDays}>
      <DaysOpenState
        periods={periods}
        days={days}
        listWeekdaysOpen={listWeekdaysOpen}
      />
    </ul>
  );
};
