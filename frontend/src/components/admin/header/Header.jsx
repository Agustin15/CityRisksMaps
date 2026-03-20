import styles from "./Header.module.css";
import iconAdd from "../../../assets/img/add.png";
import { useCrud } from "../../../contexts/adminContext/CrudContext";

export const Header = ({ title, setAddForm }) => {
  const { searcher } = useCrud();

  return (
    <div className={styles.header}>
      <h3>{title}</h3>
      <div className={styles.controls}>
        <button onClick={() => setAddForm(true)}>
          <span>Agregar</span>
          <img src={iconAdd}></img>
        </button>
        <input
          onChange={(event) => searcher(event.target.value)}
          type="text"
          placeholder="Buscar..."
        ></input>
      </div>
    </div>
  );
};
