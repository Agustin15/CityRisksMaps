import { useContext } from "react";
import { createContext, useEffect, useState } from "react";

const WindowResizeContext = createContext();

export const WindowResizeProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", (event) => {
      setWindowWidth(event.target.innerWidth);
    });
  }, []);

  return (
    <WindowResizeContext.Provider value={{ windowWidth }}>
      {children}
    </WindowResizeContext.Provider>
  );
};

export const useWindowResize = () => useContext(WindowResizeContext);
