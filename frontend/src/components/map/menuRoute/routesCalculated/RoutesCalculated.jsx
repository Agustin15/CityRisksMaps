import styles from "./RoutesCalculated.module.css";
import iconCar from "../../../../assets/img/car.png";
import iconWalk from "../../../../assets/img/walk.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import iconTrain from "../../../../assets/img/train.png";
import { useRoutes } from "../../../../contexts/RoutesContext.jsx";
import { convertDuration, convertDistance } from "./functions.js";

export const RoutesCalculated = ({ routes, transportSelected }) => {
  const { routeSelected } = useRoutes();

  const iconsTransports = [
    { transport: "Drive", icon: iconCar },
    { transport: "Walk", icon: iconWalk },
    { transport: "Two-wheeled vehicle", icon: iconMotorBike },
    { transport: "Transit", icon: iconTrain }
  ];

  return (
    <ul className={styles.containRoutes}>
      {routes.map((route, index) => (
        <li
          key={index}
          className={routeSelected == index ? styles.routeSelected : ""}
        >
          <div className={styles.row}>
            <img
              src={
                iconsTransports.find(
                  (transport) => transport.transport == transportSelected
                ).icon
              }
            ></img>
            <div className={styles.columnOne}>
              <p>{route.legs[0].steps[0].navigationInstruction.instructions}</p>
              <span className={styles.spanDetails}>Detalles</span>
            </div>
          </div>

          <div className={styles.columnTwo}>
            <span className={styles.duration}>
              {convertDuration(parseInt(route.duration))}
            </span>
            <span>{convertDistance(parseInt(route.distanceMeters))}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
