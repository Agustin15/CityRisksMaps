import { useNavigation } from "../../../contexts/NavigationContext";
import {
  convertDuration,
  convertDistance
} from "../menuRoute/routesCalculated/functions.js";
import styles from "./Navigation.module.css";

export const Navigation = () => {
  const { routeNavigation } = useNavigation();

  return (
    <div className={styles.navigation}>
      <div className={styles.indications}>
        <div className={styles.step}>
          {routeNavigation.legs[0].steps[0].navigationInstruction.instructions}
        </div>

        <div className={styles.detailsStep}>
          <h4>
            {convertDuration(
              parseInt(routeNavigation.legs[0].steps[0].staticDuration)
            )}
          </h4>
          <span>
            {convertDistance(routeNavigation.legs[0].steps[0].distanceMeters)}
          </span>
        </div>
      </div>
    </div>
  );
};
