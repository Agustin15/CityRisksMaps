import { useContext } from "react";
import { createContext, useEffect, useState } from "react";

const WindowResizeContext = createContext();

export const WindowResizeProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener("resize", (event) => {
      setWindowWidth(event.target.innerWidth);
      setWindowHeight(event.target.innerHeight);
    });
  }, []);

  return (
    <WindowResizeContext.Provider value={{ windowWidth, windowHeight }}>
      {children}
    </WindowResizeContext.Provider>
  );
};

export const useWindowResize = () => useContext(WindowResizeContext);
