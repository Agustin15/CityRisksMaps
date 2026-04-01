import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";

export const Add = ({ setAddForm }) => {
  const [name, setName] = useState("");
  const [errorForm, setErrorForm] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, index, setRegisters, pages, setPages } =
    useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name.length == 0) {
      setErrorForm("*Debe ingresar un nombre");
      return;
    }
    setErrorForm();

    let url = "/department/";
    const result = await fetchPostOrPut(url, "POST", setLoading, {
      name: name
    });

    if (result) {
      alertSwalSuccess("¡Registro de departamento agregado exitosamente!");

      let url = "/department/departmentsOffset/" + index * 10;

      let departments = await fetchGet(url);
      setRegisters(departments.registersOffset);
      if (departments.pages != pages) setPages(neighborhoods.pages);
      setName("");
    }
    return;
  };

  return (
    <div className={styles.containAdd}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar departamento</h3>
        <button onClick={() => setAddForm(false)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <form onSubmit={(event) => handleSubmit(event)}>
        <div className={styles.columnInput}>
          <label>Nombre:</label>
          <input
            autoComplete="off"
            name="name"
            onChange={(event) => setName(event.target.value.trim())}
            maxLength={30}
            placeholder="Ingrese nombre"
            type="text"
            value={name}
          ></input>
          {errorForm && <p>{errorForm}</p>}
        </div>

        <button disabled={loading} className={styles.add} type="submit">
          {loading ? "Agregando..." : "Agregar"}
        </button>
      </form>
    </div>
  );
};
