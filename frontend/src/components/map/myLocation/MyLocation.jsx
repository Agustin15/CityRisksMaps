import styles from "./MyLocation.module.css";
import { useNavigation } from "../../../contexts/navigationContext/NavigationContext";

export const MyLocation = () => {
  const { routeNavigation } = useNavigation();

  return (
    <div
      className={
        !routeNavigation
          ? styles.backgroundMyLocation
          : styles.containMyNavigation
      }
    >
      {!routeNavigation ? (
        <div className={styles.myLocation}>
          <div className={styles.content}></div>
        </div>
      ) : (
        <div className={styles.myLocationNavigate}></div>
      )}
    </div>
  );
};
