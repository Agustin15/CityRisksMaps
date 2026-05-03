import styles from "./EditWithList.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { Form } from "./form/Form";

export const EditWithList = ({ setEditForm }) => {
  const { crimes, setRegisters, crimeSelected, yearSelected } = useCrud();

  return (
    <div className={styles.containEdit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar denuncias de delitos de barrios</h3>
        <button onClick={() => setEditForm(false)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <Form />
    </div>
  );
};
