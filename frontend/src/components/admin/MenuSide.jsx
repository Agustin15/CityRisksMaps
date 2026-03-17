import styles from "./MenuSide.module.css";
import iconDepartaments from "../../assets/img/departments.png";
import iconNeighborhoods from "../../assets/img/neighborhoods.png";
import iconCrimes from "../../assets/img/crimes.png";
import iconUsers from "../../assets/img/users.png";
import iconRols from "../../assets/img/rols.png";
import iconZones from "../../assets/img/zones.png";
import iconPopulation from "../../assets/img/populationsTwo.png";
import iconLogo from "../../assets/img/logo.png";
import { useCookies } from "react-cookie";

export const MenuSide = () => {
  const [cookies] = useCookies();

  return (
    <nav className={styles.menu}>
      <div className={styles.logo}>
        <img src={iconLogo}></img>
        <span>AdminIDM</span>
      </div>
      <ul>
        <li>
          <img src={iconDepartaments}></img>
          <a href="/Departamentos">Departamentos</a>
        </li>
        <li>
          <img src={iconNeighborhoods}></img>
          <a href="/Barrios">Barrios</a>
        </li>
        <li>
          <img src={iconPopulation}></img>
          <a href="/Poblaciones"> Poblaciones</a>
        </li>
        <li>
          <img src={iconCrimes}></img>
          <a href="/TipoDelitos"> Tipos de delitos</a>
        </li>
        <li>
          <img src={iconCrimes}></img>
          <a href="/DeltitosBarrios"> Delitos en barrios</a>
        </li>
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
    </nav>
  );
};
