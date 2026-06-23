import { createContext, useContext, useEffect, useState } from "react";
import style from "../components/admin/menuSide/MenuSide.module.css";

const MenuResponsiveContext = createContext();

export const MenuResponsiveProvider = ({ children }) => {
  const [classname, setClassname] = useState(`${style.menu} ${style.showMenu}`);

  const handleClick = () => {
    if (classname.indexOf(style.hideMenu) > -1)
      setClassname(`${style.menu} ${style.showMenu}`);
    else setClassname(`${style.menu} ${style.hideMenu}`);
  };

  return (
    <MenuResponsiveContext.Provider value={{ handleClick, classname }}>
      {children}
    </MenuResponsiveContext.Provider>
  );
};

export const useMenuResponsive = () => useContext(MenuResponsiveContext);
