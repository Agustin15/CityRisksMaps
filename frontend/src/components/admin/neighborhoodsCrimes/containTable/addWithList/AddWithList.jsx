import styles from "./AddWithList.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { Form } from "./form/Form";

export const AddWithList = ({ setAddForm }) => {
  const { crimes, setRegisters, crimeSelected, yearSelected } = useCrud();

  return (
    <div className={styles.containAdd}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar denuncias de delitos de barrios</h3>
        <button onClick={() => setAddForm(false)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <Form />
    </div>
  );
};
