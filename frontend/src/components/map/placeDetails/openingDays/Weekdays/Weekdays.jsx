import styles from "./Weekdays.module.css";

export const Weekdays = ({ periods }) => {
  const weekdayFormat = (period) => {
    return Array.from(period).map((char, index) => {
      if (index == 0) return char.toUpperCase();
      return char;
    });
  };

  return (
    <ul className={styles.periods}>
      {periods.map((weekday, index) => (
        <li key={index}>
          <span
            className={new Date().getDay() == index + 1 ? styles.today : ""}
          >
            {weekdayFormat(weekday)}
          </span>
        </li>
      ))}
    </ul>
  );
};
