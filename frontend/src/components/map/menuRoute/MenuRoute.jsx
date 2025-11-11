import styles from "./MenuRoutes.module.css";
import iconDestiny from "../../../assets/img/destinyAddress.png";
import iconOrigin from "../../../assets/img/origin.png";
import { useRoutes } from "../../../contexts/RoutesContext";
import { Transports } from "./transports/Transports";

export const MenuRoute = () => {
  const { destiny } = useRoutes();
  return (
    <div className={styles.menuRoute}>
      <div className={styles.column}>
        <div className={styles.origin}>
          <img src={iconOrigin}></img>
          <input placeholder="Ingrese punto de partida" type="text"></input>
        </div>
        <div className={styles.destiny}>
          <img src={iconDestiny}></img>
          <input type="text" value={destiny.address}></input>
        </div>

        <Transports></Transports>
        {/* <div className={styles.myLocation}>
          <img src=""></img>
        </div> */}
      </div>
    </div>
  );
};
