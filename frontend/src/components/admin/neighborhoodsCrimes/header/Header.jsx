import styles from "./Header.module.css";
import iconAdd from "../../../../assets/img/add.png";
import iconMenuBackoffice from "../../../../assets/img/menuBackoffice.png";
import iconUpdate from "../../../../assets/img/edit.png";
import { useAuth } from "../../../../contexts/adminContext/AuthContext";
import { useMenuResponsive } from "../../../../contexts/MenuResponsiveContext";

export const Header = ({ setAddForm, setEditForm }) => {
  const { user } = useAuth();
  const { handleClick } = useMenuResponsive();

  return (
    <div className={styles.header}>
      <h3>
        <button onClick={handleClick} className={styles.displayMenu}>
          <img src={iconMenuBackoffice}></img>
        </button>
        Indice de delitos en barrios
      </h3>

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
