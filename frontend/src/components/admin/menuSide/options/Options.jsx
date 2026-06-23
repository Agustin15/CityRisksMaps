const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import styles from "./Options.module.css";
import iconSubmenu from "../../../../assets/img/submenu.png";
import iconSubmenuShowed from "../../../../assets/img/submenuShowed.png";
import { getListOptions } from "./functions.js";
import { useRef, useState } from "react";
import { matchPath, useLocation } from "react-router";

export const Options = ({ user }) => {
  const location = useLocation();
  const checkbox = useRef();

  const options = getListOptions(user);
  const optionsAllowed = options.filter((option) => option.allow == true);

  if (
    checkbox.current &&
    matchPath("admin/indice-delitos-barrios/auditoria", location.pathname)
  ) {
    checkbox.current.checked = true;
  }

  return (
    <div className={styles.containOptions}>
      <ul className={styles.options}>
        {optionsAllowed.map((option, index) => (
          <li key={index}>
            <div
              className={
                option.paths.some((path) =>
                  matchPath(path, location.pathname)
                ) ||
                (option.submenu &&
                  option.submenu.paths.some((path) =>
                    matchPath(path, location.pathname)
                  ))
                  ? styles.selected
                  : styles.mainOption
              }
            >
              <div className={option.divStyle}></div>
              <a href={LOCALHOST_FRONTEND + option.paths[0]}>{option.title}</a>

              {option.submenu && option.submenu.allow && (
                <button className={styles.btnSubmenu}>
                  <label htmlFor="checkboxSubmenu">
                    <img
                      src={
                        option.paths.some(
                          (path) => location.pathname.indexOf(path) > -1
                        )
                          ? iconSubmenuShowed
                          : iconSubmenu
                      }
                    ></img>
                  </label>
                  <input
                    ref={checkbox}
                    id="checkboxSubmenu"
                    type="checkbox"
                  ></input>
                </button>
              )}
            </div>

            {option.submenu && option.submenu.allow && (
              <ul className={styles.submenu}>
                <li>
                  <div className={option.submenu.divStyle}></div>
                  <a href={LOCALHOST_FRONTEND + option.submenu.paths[0]}>
                    {option.submenu.title}
                  </a>
                </li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
