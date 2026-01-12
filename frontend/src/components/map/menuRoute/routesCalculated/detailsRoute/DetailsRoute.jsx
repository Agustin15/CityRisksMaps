import styles from "./DetailsRoute.module.css";
import { convertDistance, convertDuration } from "../functions.js";


export const DetailsRoute = ({ steps }) => {

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
        </li>
      ))}
    </ul>
  );
};
