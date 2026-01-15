import styles from "./Options.module.css";
import iconDetailsRoute from "../../../../../assets/img/detailsRoute.png";
import iconNavigator from "../../../../../assets/img/navigator.png";
import { useMapControls } from "../../../../../contexts/MapContext";
import { useNavigation } from "../../../../../contexts/NavigationContext";

export const Options = ({ index, showDetails, handleDetails }) => {
  const { userLocation } = useMapControls();
  const { handleNavigation } = useNavigation();

  return (
    <div className={styles.options}>
      <button
        onClick={() => handleDetails(index)}
        className={styles.showDetails}
      >
        {showDetails == index ? "Cerrar" : "Pasos"}
        <img src={iconDetailsRoute}></img>
      </button>
      {userLocation && (
        <button onClick={() => handleNavigation()}>
          Navegar
          <img src={iconNavigator}></img>
        </button>
      )}
    </div>
  );
};
