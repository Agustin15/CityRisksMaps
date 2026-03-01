import styles from "./MyLocation.module.css";
import iconNavigation from "../../../assets/img/currentNavigation.png";
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
        <img src={iconNavigation}></img>
      )}
    </div>
  );
};
