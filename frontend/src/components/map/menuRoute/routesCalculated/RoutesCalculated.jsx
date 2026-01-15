import styles from "./RoutesCalculated.module.css";
import iconCar from "../../../../assets/img/car.png";
import iconWalk from "../../../../assets/img/walk.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import iconTrain from "../../../../assets/img/train.png";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { RouteRangesDanger } from "./routeRangesDanger/RouteRangesDanger.jsx";
import { DetailsRoute } from "./detailsRoute/DetailsRoute.jsx";
import { Options } from "./options/Options.jsx";
import { convertDuration, convertDistance, changeRoute } from "./functions.js";

export const RoutesCalculated = ({
  routes,
  transportSelected,
  showDetails,
  setShowDetails
}) => {
  const { routeSelected, setRouteSelected, polylines, setPolylines } =
    useRoutes();

  const iconsTransports = [
    { transport: "Drive", icon: iconCar },
    { transport: "Walk", icon: iconWalk },
    { transport: "Two_wheeler", icon: iconMotorBike },
    { transport: "Transit", icon: iconTrain }
  ];

  const handleClick = (index) => {
    if (routeSelected != index) {
      setRouteSelected(index);
      changeRoute(index, polylines, setPolylines);
    }
  };
  const handleDetails = (index) => {
    if (showDetails == index) setShowDetails();
    else setShowDetails(index);
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

                <Options
                  index={index}
                  showDetails={showDetails}
                  handleDetails={handleDetails}
                />
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
