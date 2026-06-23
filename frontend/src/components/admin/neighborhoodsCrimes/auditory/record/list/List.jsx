import styles from "./List.module.css";
import iconPK from "../../../../../../assets/img/primaryKey.png";
import iconDelete from "../../../../../../assets/img/deleteDML.png";
import iconInsert from "../../../../../../assets/img/insertDML.png";
import { defineAction, defineIcon } from "./functions.js";
import { formatDate } from "../../../../functions.js";

export const List = ({ registers }) => {
  return (
    <ul className={styles.recordList}>
      {registers.map((register, index) => (
        <li
          className={index % 2 == 0 ? styles.liGray : styles.liWhite}
          key={index}
        >
          <span className={styles.auditoryDate}>
            <b>Fecha de la accion:</b>{" "}
            {formatDate(new Date(register.auditoryDate))}
          </span>

          <div className={styles.row}>
            <div className={styles.action}>
              <h2>{defineAction(register.actionName)}</h2>
              <img src={defineIcon(register.actionName)} />
            </div>
            <div className={styles.data}>
              <div className={styles.primaryKey}>
                <div className={styles.title}>
                  <img src={iconPK} />
                  <b>Identificador de delito:</b>
                </div>

                <ul>
                  <li>
                    <b>Barrio:</b>
                    {register.nameNeighborhood}
                  </li>
                  <li>
                    <b>Delito:</b>
                    {register.crime}
                  </li>
                  <li>
                    <b>Año:</b>
                    {register.year}
                  </li>
                </ul>
              </div>

              <div className={styles.oldValues}>
                <div className={styles.title}>
                  <img src={iconDelete} />
                  <b>Valores antiguos:</b>
                </div>
                <p>{register.oldValues}</p>
              </div>
              <div className={styles.newValues}>
                <div className={styles.title}>
                  <img src={iconInsert} />
                  <b>Valores nuevos:</b>
                </div>
                <p>{register.newValues}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
