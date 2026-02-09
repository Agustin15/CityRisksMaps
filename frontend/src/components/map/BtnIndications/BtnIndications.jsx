import styles from "./BtnIndications.module.css";
import iconDestination from "../../../assets/img/destination.png";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";

export const BtnIndications = () => {
  const { handleClickRoute } = useRoutes();
  const { selectedPlace, placesSearched, setPlacesSearched } = useSearchPlace();

  return (
    <button
      onClick={() => {
        if (placesSearched) setPlacesSearched();
        handleClickRoute(selectedPlace);
      }}
      className={styles.buttonStartRoute}
    >
      <img src={iconDestination}></img>
    </button>
  );
};
