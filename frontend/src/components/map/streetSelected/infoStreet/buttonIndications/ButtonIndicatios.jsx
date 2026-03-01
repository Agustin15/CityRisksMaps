import styles from "./ButtonIndications.module.css";
import iconDestination from "../../../../../assets/img/destination.png";
import { useRoutes } from "../../../../../contexts/routesContext/RoutesContext";

export const ButtonIndications = ({ streetSelected, lat, lng }) => {
  const { handleClickRoute } = useRoutes();

  return (
    <button
      className={styles.btnIndications}
      onClick={() =>
        handleClickRoute(streetSelected[0].formatted_address, {
          latitude: lat(),
          longitude: lng()
        })
      }
    >
      Indicaciones
      <img src={iconDestination}></img>
    </button>
  );
};
