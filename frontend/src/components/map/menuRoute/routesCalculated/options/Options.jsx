import styles from "./Options.module.css";
import iconDetailsRoute from "../../../../../assets/img/detailsRoute.png";
import iconNavigator from "../../../../../assets/img/navigator.png";
import { useMapControls } from "../../../../../contexts/MapContext";
import { useNavigation } from "../../../../../contexts/navigationContext/NavigationContext";

export const Options = ({ indexRoute, showDetails, setShowDetails }) => {
  const { userLocation } = useMapControls();
  const { handleNavigation } = useNavigation();

  const handleDetails = (indexRoute) => {
    if (showDetails == indexRoute) setShowDetails();
    else setShowDetails(indexRoute);
  };

  return (
    <div className={styles.options}>
      <button
        onClick={() => handleDetails(indexRoute)}
        className={styles.showDetails}
      >
        {showDetails == indexRoute ? "Cerrar" : "Pasos"}
        <img src={iconDetailsRoute}></img>
      </button>

      {userLocation && (
        <button onClick={() => handleNavigation(indexRoute)}>
          Navegar
          <img src={iconNavigator}></img>
        </button>
      )}
    </div>
  );
};
