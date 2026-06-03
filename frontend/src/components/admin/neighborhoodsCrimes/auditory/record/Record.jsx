import styles from "./Record.module.css";
import iconAuditory from "../../../../../assets/img/auditoryTitle.png";
import iconDelete from "../../../../../assets/img/deleteDML.png";
import iconInsert from "../../../../../assets/img/insertDML.png";
import iconUpdate from "../../../../../assets/img/updateDML.png";
import iconPK from "../../../../../assets/img/primaryKey.png";

export const Record = () => {
  return (
    <div className={styles.record}>
      {/* <div className={styles.noData}>
        <img src={iconAuditory} />
        <h3>No hay registros de auditoria en esta fecha</h3>
      </div> */}
      <ul className={styles.recordList}>
        <li>
          <div className={styles.row}>
            <div className={styles.action}>
              <h2>Eliminación</h2>
              <img src={iconDelete} />
            </div>
            <div className={styles.foreignKey}>
              <img src={iconPK} />
              <b>Identificador de delito:</b>
              <p>Buceo,Hurto,2023</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
