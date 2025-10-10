import styles from "./PlaceDetails.module.css";
import iconClock from "../../../assets/img/clock.png";
import iconAddress from "../../../assets/img/address.png";

export const PlaceDetails = ({ place }) => {
  console.log(place);

  const nextPeriod = (openingHours, isOpen) => {
    const period = openingHours.periods.find((period) => {
      if (isOpen) {
        if (period.close.day == new Date().getDay()) return period;
      } else {
        if (period.open.day == new Date().getDay() + 1) return period;
      }
    });

    if (isOpen)
      return "Cierra a las " + period.close.hours + ":" + period.close.minutes;
    else
      return (
        "Abre a las " +
        period.open.hours +
        ":" +
        period.open.minutes +
        " del " +
        getDay(new Date(period.open.nextDate).getDay())
      );
  };

  const getDay = (weekday) => {
    const days = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo"
    ];

    return days.find((day, index) => index + 1 == weekday);
  };

  return (
    <div className={styles.containDetails}>
      <div className={styles.header}>
        <img src={place.photos[0].getUrl()}></img>
        <h3>{place.name}</h3>
      </div>

      <ul className={styles.info}>
        {place.formatted_address && (
          <li>
            <img src={iconAddress}></img>
            {place.formatted_address}
          </li>
        )}
        {place.opening_hours && (
          <li>
            <img src={iconClock}></img>
            <span
              className={
                place.opening_hours.isOpen(new Date())
                  ? styles.open
                  : styles.close
              }
            >
              {place.opening_hours.isOpen(new Date()) ? "Abierto" : "Cerrado"}
            </span>

            {nextPeriod(
              place.opening_hours,
              place.opening_hours.isOpen(new Date())
            )}
          </li>
        )}
      </ul>
    </div>
  );
};
