import styles from "./RoutesCalculated.module.css";
import iconCar from "../../../../assets/img/car.png";
import iconWalk from "../../../../assets/img/walk.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import iconTrain from "../../../../assets/img/train.png";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { useState } from "react";
import { RouteRangesDanger } from "./routeRangesDanger/RouteRangesDanger.jsx";
import { convertDuration, convertDistance } from "./functions.js";

export const RoutesCalculated = ({ routes, transportSelected }) => {
  const { routeSelected } = useRoutes();
  const [showDetails, setShowDetails] = useState(false);

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
          <div className={styles.mainRow}>
            <div className={styles.row}>
              <img
                src={
                  iconsTransports.find(
                    (transport) => transport.transport == transportSelected
                  ).icon
                }
              ></img>
              <div className={styles.columnOne}>
                <p>
                  {route.legs[0].steps[0].navigationInstruction.instructions}
                </p>

                <RouteRangesDanger route={route} />
              </div>
            </div>

            <div className={styles.columnTwo}>
              <span className={styles.duration}>
                {convertDuration(parseInt(route.duration))}
              </span>
              <span>{convertDistance(parseInt(route.distanceMeters))}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
