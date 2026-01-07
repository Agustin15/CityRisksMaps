import styles from "./RoutesCalculated.module.css";
import iconCar from "../../../../assets/img/car.png";
import iconWalk from "../../../../assets/img/walk.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import iconTrain from "../../../../assets/img/train.png";
import { useState } from "react";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { RouteRangesDanger } from "./routeRangesDanger/RouteRangesDanger.jsx";
import { convertDuration, convertDistance, changeRoute } from "./functions.js";
import { DetailsRoute } from "./detailsRoute/DetailsRoute.jsx";

export const RoutesCalculated = ({ routes, transportSelected }) => {
  const { routeSelected, setRouteSelected, polylines, setPolylines } =
    useRoutes();
  const [showDetails, setShowDetails] = useState();

  const iconsTransports = [
    { transport: "Drive", icon: iconCar },
    { transport: "Walk", icon: iconWalk },
    { transport: "Two-wheeled vehicle", icon: iconMotorBike },
    { transport: "Transit", icon: iconTrain }
  ];

  const handleClick = (index) => {
    if (routeSelected != index) {
      setRouteSelected(index);
      changeRoute(index, polylines, setPolylines);
    }
  };

  return (
    <ul className={styles.containRoutes}>
      {routes.map((route, index) => (
        <li
          onClick={() => handleClick(index)}
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

                {route.routeRangesDanger && <RouteRangesDanger route={route} />}
                <button
                  onClick={() => setShowDetails(index)}
                  className={styles.showDetails}
                >
                  Detalles
                </button>
              </div>
            </div>

            <div className={styles.columnTwo}>
              <span className={styles.duration}>
                {convertDuration(parseInt(route.duration))}
              </span>
              <span>{convertDistance(parseInt(route.distanceMeters))}</span>
            </div>
          </div>
          {showDetails == index && <DetailsRoute steps={route.legs[0].steps} />}
        </li>
      ))}
    </ul>
  );
};
