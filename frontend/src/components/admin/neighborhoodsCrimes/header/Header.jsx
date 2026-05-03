import styles from "./Header.module.css";
import iconAdd from "../../../../assets/img/add.png";
import iconUpdate from "../../../../assets/img/edit.png";
import { useAuth } from "../../../../contexts/adminContext/AuthContext";

export const Header = ({ setAddForm, setEditForm }) => {
  const { user } = useAuth();

  return (
    <div className={styles.header}>
      <h3>Indice de delitos en barrios</h3>

      <div className={styles.row}>
        {user.rol == "Admin" && (
          <>
            <button className={styles.btnAdd} onClick={() => setAddForm(true)}>
              <span>Agregar</span>
              <img src={iconAdd}></img>
            </button>
            <button
              onClick={() => setEditForm(true)}
              className={styles.btnUpdate}
            >
              <span>Actualizar</span>
              <img src={iconUpdate}></img>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
