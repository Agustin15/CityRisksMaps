import styles from "./Edit.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";

export const Edit = ({ department, setEditDepartment }) => {
  const [name, setName] = useState(department.name);
  const [errorForm, setErrorForm] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, index, setRegisters } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorForm();

    if (name.length == 0) {
      setErrorForm("*Debe ingresar un nombre");
      return;
    }

    let url = "/department/" + department.idDepartment;
    const result = await fetchPostOrPut(url, "PUT", setLoading, { name: name });

    if (result) {
      alertSwalSuccess("¡Registro de departamento actualizado exitosamente!");
      let url =
        "/department/" +
        JSON.stringify({
          option: "getDepartmentsOffset",
          offset: index * 10
        });

      let departments = await fetchGet(url);
      if (departments) {
        setRegisters(departments.registersOffset);
      }
    }
    return;
  };

  return (
    <div className={styles.containEdit}>
      <button onClick={() => setEditDepartment(null)} className={styles.close}>
        Cerrar
      </button>
      <div className={styles.title}>
        <h3>Editar departamento {department.name}</h3>

        <div className={styles.backgroundIcon}>
          <img src={iconAdd}></img>
        </div>
      </div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className={styles.columnInput}>
          <label>Nombre:</label>
          <input
            autoComplete="off"
            name="name"
            onChange={(event) => setName(event.target.value.trim())}
            maxLength={30}
            type="text"
            value={name}
          ></input>
          {errorForm && <p>{errorForm}</p>}
        </div>

        <button disabled={loading} className={styles.save} type="submit">
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
    </div>
  );
};
