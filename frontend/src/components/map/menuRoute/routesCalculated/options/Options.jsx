import styles from "./Options.module.css";
import iconDetailsRoute from "../../../../../assets/img/detailsRoute.png";
import iconNavigator from "../../../../../assets/img/navigator.png";

export const Options = ({ index, showDetails, handleDetails }) => {
  return (
    <div className={styles.options}>
      <button
        onClick={() => handleDetails(index)}
        className={styles.showDetails}
      >
        {showDetails == index ? "Cerrar" : "Pasos"}
        <img src={iconDetailsRoute}></img>
      </button>
      <button>
        Navegar
        <img src={iconNavigator}></img>
      </button>
    </div>
  );
};
