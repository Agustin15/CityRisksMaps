import { createContext, useContext, useState } from "react";

const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [showMenuRoutes, setShowMenuRoutes] = useState(false);
  const [destiny, setDestiny] = useState();

  const handleClickRoute = (place) => {
    setShowMenuRoutes(true);

    setDestiny({
      coordinates: place.location,
      address: place.formattedAddress
    });
  };

  return (
    <RoutesContext.Provider
      value={{ showMenuRoutes, handleClickRoute, destiny }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = () => useContext(RoutesContext);
