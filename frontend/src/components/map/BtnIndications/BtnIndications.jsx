import iconDestiny from "../../../assets/img/destiny.png";
import { useRoutes } from "../../../contexts/RoutesContext";
import styles from "./BtnIndications.module.css";

export const BtnIndications = () => {
  const { handleClickRoute } = useRoutes();

  return (
    <button
      onClick={() => handleClickRoute(place)}
      className={styles.buttonStartRoute}
    >
      <img src={iconDestiny}></img>
    </button>
  );
};
