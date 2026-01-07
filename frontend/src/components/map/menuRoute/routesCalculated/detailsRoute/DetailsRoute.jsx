import styles from "./DetailsRoute.module.css";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { convertDistance, convertDuration } from "../functions.js";
import { calculateRangeDangerStep } from "./functions.js";

export const DetailsRoute = ({ steps }) => {
  const { polygons } = useZoneCrimes();

  return (
    <ul className={styles.details}>
      {steps.map((step, index) => (
        <li key={index}>
          <p>{step.navigationInstruction.instructions}</p>
          <div className={styles.detailsInstruction}>
            <span className={styles.duration}>
              {convertDuration(parseInt(step.staticDuration))}
            </span>
            ({convertDistance(parseInt(step.distanceMeters))})
          </div>
          {calculateRangeDangerStep(step, polygons)}
        </li>
      ))}
    </ul>
  );
};
