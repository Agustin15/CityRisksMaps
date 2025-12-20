import { createContext, useContext, useState } from "react";

const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [showMenuRoutes, setShowMenuRoutes] = useState(false);
  const [destiny, setDestiny] = useState("");
  const [origin, setOrigin] = useState("");

  const handleClickRoute = (place) => {
    setShowMenuRoutes(true);

    setDestiny(place.formattedAddress);
  };

  return (
    <RoutesContext.Provider
      value={{
        showMenuRoutes,
        setShowMenuRoutes,
        handleClickRoute,
        origin,
        destiny,
        setOrigin,
        setDestiny
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = () => useContext(RoutesContext);
