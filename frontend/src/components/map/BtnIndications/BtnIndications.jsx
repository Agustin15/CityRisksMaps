import styles from "./BtnIndications.module.css";
import iconDestiny from "../../../assets/img/destiny.png";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext";
import { useSearchPlace } from "../../../contexts/SearchPlaceContext";

export const BtnIndications = () => {
  const { handleClickRoute } = useRoutes();
  const { selectedPlace } = useSearchPlace();

  return (
    <button
      onClick={() => handleClickRoute(selectedPlace)}
      className={styles.buttonStartRoute}
    >
      <img src={iconDestiny}></img>
    </button>
  );
};
