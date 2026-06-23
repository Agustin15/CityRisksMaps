import styles from "./Header.module.css";
import iconAdd from "../../../assets/img/add.png";
import iconMenuBackoffice from "../../../assets/img/menuBackoffice.png";
import iconAddWithList from "../../../assets/img/addWithList.png";
import { useCrud } from "../../../contexts/adminContext/CrudContext";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useRef } from "react";
import { useLocation, useParams } from "react-router";
import { useMenuResponsive } from "../../../contexts/MenuResponsiveContext";
import { Years } from "./years/Years";

export const Header = ({ title, setAddForm, route, controller }) => {
  const { searcher, years } = useCrud();
  const { user } = useAuth();
  const inputRef = useRef();
  const params = useParams();
  const location = useLocation();
  const { handleClick } = useMenuResponsive();

  return (
    <div className={styles.header}>
      <h3>
        <button onClick={handleClick} className={styles.displayMenu}>
          <img src={iconMenuBackoffice}></img>
        </button>
        {title}
      </h3>

      <div className={styles.row}>
        {user.rol == "Admin" && Object.keys(params).length == 0 && (
          <button onClick={() => setAddForm(true)}>
            <span>Agregar</span>
            <img src={iconAdd}></img>
          </button>
        )}

        <input
          onChange={() => searcher(inputRef.current.value)}
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
        ></input>

        {years && <Years years={years} route={route} />}
      </div>
    </div>
  );
};
