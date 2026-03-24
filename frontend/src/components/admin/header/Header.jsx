import styles from "./Header.module.css";
import iconAdd from "../../../assets/img/add.png";
import iconAvatar from "../../../assets/img/avatar.png";
import { useCrud } from "../../../contexts/adminContext/CrudContext";
import { useRef } from "react";

export const Header = ({ title, setAddForm }) => {
  const { searcher } = useCrud();
  const inputRef = useRef();

  return (
    <div className={styles.header}>
      <h3>{title}</h3>
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
    </div>
  );
};
