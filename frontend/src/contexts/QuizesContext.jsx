import { createContext, useState } from "react";

const QuizesContext = createContext();

export const QuizesProvider = ({ children }) => {
  const [neighborhoodsQuizesByYear, setNeighborhoodsQuizesByYear] = useState();
  const { neighbordhoodsCoordinates } = useMapControls();

  return <QuizesContext.Provider value={{}}>{children}</QuizesContext.Provider>;
};
