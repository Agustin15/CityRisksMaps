import { useContext } from "react";
import { createContext, useEffect, useState } from "react";

const WindowResizeContext = createContext();

export const WindowResizeProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (windowWidth != window.innerWidth) setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <WindowResizeContext.Provider value={{ windowWidth }}>
      {children}
    </WindowResizeContext.Provider>
  );
};

export const useWindowResize = () => useContext(WindowResizeContext);
