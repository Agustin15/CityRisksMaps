import iconEdit from "../../../../../assets/img/edit.png";
import styles from "./Edit.module.css";

export const Edit = ({ departamento }) => {
  return (
    <div className={styles.containEdit}>
      <button className={styles.close}>Cerrar</button>

      <div className={styles.title}>
        <h3>Editar departamento {departamento.name}</h3>
        <div className={styles.backgroundIcon}>
          <img src={iconEdit}></img>
        </div>
      </div>
    </div>
  );
};
