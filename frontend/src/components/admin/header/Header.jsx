import styles from "./Header.module.css";
import iconAdd from "../../../assets/img/add.png";
import { useCrud } from "../../../contexts/adminContext/CrudContext";
import { useRef } from "react";
import { Years } from "./years/Years";

export const Header = ({ title, setAddForm, route, controller }) => {
  const { searcher, years } = useCrud();
  const inputRef = useRef();

  return (
    <div className={styles.header}>
      <h3>{title}</h3>

      <div className={styles.row}>
      <button onClick={() => setAddForm(true)}>
        <span>Agregar</span>
        <img src={iconAdd}></img>
      </button>

      <input
        onChange={() => searcher(inputRef.current.value)}
        ref={inputRef}
        type="text"
        placeholder="Buscar..."
      ></input>

      {years && <Years years={years} route={route} controller={controller} />}
      </div>
    </div>
  );
};
