import styles from "./Transports.module.css";
import iconWalk from "../../../../assets/img/walk.png";
import iconCar from "../../../../assets/img/car.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";

export const Transports = () => {
  const {
    transportSelected,
    destination,
    originLocation,
    setTransportSelected,
    showRoutes
  } = useRoutes();

  const { crimeSelected } = useNeighborhoodsCrimes();

  const handleClick = (transport) => {
    if (
      destination.length > 0 &&
      originLocation &&
      crimeSelected == "Homicidio"
    ) {
      setTransportSelected(transport);
      showRoutes(transport);
    } else return;
  };

  return (
    <ul className={styles.transports}>
      <li
        onClick={() => handleClick("Drive")}
        className={transportSelected == "Drive" ? styles.selected : ""}
      >
        <img src={iconCar}></img>
      </li>
      <li
        onClick={() => handleClick("Two_wheeler")}
        className={transportSelected == "Two_wheeler" ? styles.selected : ""}
      >
        <img src={iconMotorBike}></img>
      </li>

      <li
        onClick={() => handleClick("Walk")}
        className={transportSelected == "Walk" ? styles.selected : ""}
      >
        <img src={iconWalk}></img>
      </li>
    </ul>
  );
};
