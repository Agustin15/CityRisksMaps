import styles from "./RoutesCalculated.module.css";
import iconCar from "../../../../assets/img/car.png";
import iconWalk from "../../../../assets/img/walk.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import { useRoutes } from "../../../../contexts/routesContext/RoutesContext";
import { RouteRangesDanger } from "./routeRangesDanger/RouteRangesDanger.jsx";
import { DetailsRoute } from "./detailsRoute/DetailsRoute.jsx";
import { Options } from "./options/Options.jsx";
import { changeRoute } from "./functions.js";
import { Duration } from "./duration/Duration.jsx";
import { useWindowResize } from "../../../../contexts/WindowResizeContext.jsx";

export const RoutesCalculated = ({
  routes,
  transportSelected,
  showDetails,
  setShowDetails
}) => {
  const { indexRouteSelected, setIndexRouteSelected, polylines, setPolylines } =
    useRoutes();
  const { windowWidth } = useWindowResize();

  const iconsTransports = [
    { transport: "Drive", icon: iconCar },
    { transport: "Walk", icon: iconWalk },
    { transport: "Two_wheeler", icon: iconMotorBike },
  ];

  const handleClick = (index) => {
    if (indexRouteSelected != index) {
      setIndexRouteSelected(index);
      changeRoute(index, polylines, setPolylines);
    }
  };

  return (
    <ul className={styles.containRoutes}>
      {routes.map((route, index) => (
        <li
          onClick={() => handleClick(index)}
          key={index}
          className={indexRouteSelected == index ? styles.routeSelected : ""}
        >
          <div className={styles.mainRow}>
            <div className={styles.row}>
              <div className={styles.typeTransport}>
                <img
                  src={
                    iconsTransports.find(
                      (transport) => transport.transport == transportSelected
                    ).icon
                  }
                ></img>

                {windowWidth < 1000 && <Duration route={route} />}
              </div>

              <div className={styles.columnOne}>
                <p>
                  {route.legs[0].steps[0].navigationInstruction.instructions}
                </p>

                {route.routeRangesDanger && <RouteRangesDanger route={route} />}

                <Options
                  indexRoute={index}
                  showDetails={showDetails}
                  setShowDetails={setShowDetails}
                />
              </div>
            </div>

            {windowWidth >= 1000 && <Duration route={route} />}
          </div>
          {showDetails == index && <DetailsRoute steps={route.legs[0].steps} />}
        </li>
      ))}
    </ul>
  );
};
