import styles from "./MenuRoutes.module.css";
import { useRoutes } from "../../../contexts/routesContext/RoutesContext.jsx";
import { useMapControls } from "../../../contexts/MapContext.jsx";
import { useState } from "react";
import { OptionsAddress } from "./optionsAddress/OptionsAddress.jsx";
import { getSuggestions } from "./functions.js";
import { RoutesCalculated } from "./routesCalculated/RoutesCalculated.jsx";
import { Transports } from "./transports/Transports.jsx";
import { EnterAdresses } from "./enterAddresses/EnterAdresses.jsx";

export const MenuRoute = () => {
  const [suggestions, setSuggestions] = useState();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState();
  const { userLocation } = useMapControls();

  const {
    setOrigin,
    setOriginLocation,
    origin,
    handleClose,
    setRoutes,
    routes,
    setRouteSelected,
    transportSelected,
    cleanPolylines
  } = useRoutes();

  const handleChange = async (value) => {
    setOrigin(value);
    if (value.length == 0) {
      setSuggestions();
      cleanPolylines();
      setRoutes();
      setRouteSelected();
      setOriginLocation();
    }
  };

  const handleSearchSuggestions = async () => {
    getSuggestions(userLocation, origin, setSuggestions, setLoading);
  };

  return (
    <div className={styles.menuRoute}>
      <div className={styles.close}>
        <button onClick={() => handleClose(setSuggestions)}>x</button>
      </div>
      <Transports />

      <EnterAdresses
        handleChange={handleChange}
        handleSearchSuggestions={handleSearchSuggestions}
        loading={loading}
      />

      {suggestions && (
        <OptionsAddress
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
      )}

      {routes && (
        <RoutesCalculated
          routes={routes}
          transportSelected={transportSelected}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
};
