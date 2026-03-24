const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./MenuSide.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconLogout from "../../assets/img/logout.png";
import { matchPath, useLocation, useNavigate } from "react-router";
import { useCookies } from "react-cookie";

export const MenuSide = () => {
  const [cookies] = useCookies();
  let navigate = useNavigate();
  let location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await fetch(LOCALHOST_BACKEND + "/logout/", {
        method: "POST"
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.messageError);
      if (result) {
        navigate("/admin/login");
        removeCookie("nameAndLastname");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className={styles.menu}>
      <div className={styles.contentMenu}>
        <div className={styles.logo}>
          <img src={iconLogo}></img>
          <span>IDM ADMIN</span>
        </div>
        <ul>
          <li
            className={
              matchPath(
                {
                  path: "/admin/departamentos",
                  caseSensitive: true
                },
                location.pathname
              )
                ? styles.selected
                : ""
            }
          >
            <div className={styles.iconDepartments}></div>
            <a href={LOCALHOST_FRONTEND + "/admin/departamentos"}>
              Departamentos
            </a>
          </li>
          <li
            className={
              matchPath(
                {
                  path:
                    "/admin/barrios/" ||
                    "/admin/barrios/departamentos/:controller/:id",
                  caseSensitive: true
                },
                location.pathname
              )
                ? styles.selected
                : ""
            }
          >
            <div className={styles.iconNeighborhoods}></div>
            <a href={LOCALHOST_FRONTEND + "/admin/barrios"}>Barrios</a>
          </li>
          <li
            className={
              matchPath(
                {
                  path:
                    "/admin/poblaciones/" ||
                    "/admin/poblaciones/barrios/:controller/:id",
                  caseSensitive: true
                },
                location.pathname
              )
                ? styles.selected
                : ""
            }
          >
            <div className={styles.iconPopulation}></div>
            <a href={LOCALHOST_FRONTEND + "/admin/poblaciones"}>Poblaciones</a>
          </li>
          <li>
            <div className={styles.iconCrimes}></div>
            <a href="/tipoDelitos"> Tipos de delitos</a>
          </li>
          {/* <li>
    
          <a href="/DeltitosBarrios"> Delitos en barrios</a>
        </li> */}
          <li>
            <div className={styles.iconZones}></div>
            <a href="/Zonas"> Zonas de riesgo</a>
          </li>
          <li>
            <div className={styles.iconRols}></div>
            <a href="/Roles"> Roles</a>
          </li>
          <li>
            <div className={styles.iconUsers}></div>
            <a href="/Usuarios"> Usuarios</a>
          </li>
        </ul>
        <div className={styles.avatar}>
          <div>
            {cookies.nameAndLastname.name.substring(0, 1) +
              "" +
              cookies.nameAndLastname.lastname.substring(0, 1)}
          </div>
          <span>
            {cookies.nameAndLastname.name +
              " " +
              cookies.nameAndLastname.lastname}
          </span>
          <button onClick={() => handleLogout()}>
            <img src={iconLogout}></img>
          </button>
        </div>
      </div>
    </nav>
  );
};
