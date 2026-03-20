const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./MenuSide.module.css";
import iconDepartaments from "../../assets/img/departments.png";
import iconNeighborhoods from "../../assets/img/neighborhoods.png";
import iconCrimes from "../../assets/img/crimes.png";
import iconUsers from "../../assets/img/users.png";
import iconRols from "../../assets/img/rols.png";
import iconZones from "../../assets/img/zones.png";
import iconPopulation from "../../assets/img/populationsTwo.png";
import iconLogo from "../../assets/img/logo.png";
import iconLogout from "../../assets/img/logout.png";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export const MenuSide = () => {
  const [cookies] = useCookies();
  let navigate = useNavigate();

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
      <div className={styles.logo}>
        <img src={iconLogo}></img>
        <span>AdminIDM</span>
      </div>
      <ul>
        <li
          className={
            location.href.toLowerCase().indexOf("departamentos") > -1
              ? styles.selected
              : ""
          }
        >
          <img src={iconDepartaments}></img>
          <a href={LOCALHOST_FRONTEND + "/admin/departamentos"}>
            Departamentos
          </a>
        </li>
        <li
          className={
            location.href.toLowerCase().indexOf("barrios") > -1
              ? styles.selected
              : ""
          }
        >
          <img src={iconNeighborhoods}></img>
          <a href={LOCALHOST_FRONTEND + "/admin/barrios"}>Barrios</a>
        </li>
        <li>
          <img src={iconPopulation}></img>
          <a href="/poblaciones"> Poblaciones</a>
        </li>
        <li>
          <img src={iconCrimes}></img>
          <a href="/tipoDelitos"> Tipos de delitos</a>
        </li>
        {/* <li>
          <img src={iconCrimes}></img>
          <a href="/DeltitosBarrios"> Delitos en barrios</a>
        </li> */}
        <li>
          <img src={iconZones}></img>
          <a href="/Zonas"> Zonas de riesgo</a>
        </li>
        <li>
          <img src={iconRols}></img>
          <a href="/Roles"> Roles</a>
        </li>
        <li>
          <img src={iconUsers}></img>
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
    </nav>
  );
};
