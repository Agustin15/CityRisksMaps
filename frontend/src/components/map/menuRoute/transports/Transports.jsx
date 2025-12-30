import styles from "./Transports.module.css";
import iconWalk from "../../../../assets/img/walk.png";
import iconCar from "../../../../assets/img/car.png";
import iconTrain from "../../../../assets/img/train.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";

export const Transports = () => {
  const { transportSelected, setTransportSelected } = useRoutes();
  return (
    <ul className={styles.transports}>
      <li
        onClick={() => setTransportSelected("Drive")}
        className={transportSelected == "Drive" ? styles.selected : ""}
      >
        <img src={iconCar}></img>
      </li>
      <li
        onClick={() => setTransportSelected("Two-wheeled vehicle")}
        className={
          transportSelected == "Two-wheeled vehicle" ? styles.selected : ""
        }
      >
        <img src={iconMotorBike}></img>
      </li>
      <li
        onClick={() => setTransportSelected("Transit")}
        className={transportSelected == "Transit" ? styles.selected : ""}
      >
        <img src={iconTrain}></img>
      </li>
      <li
        onClick={() => setTransportSelected("Walk")}
        className={transportSelected == "Walk" ? styles.selected : ""}
      >
        <img src={iconWalk}></img>
      </li>
    </ul>
  );
};
