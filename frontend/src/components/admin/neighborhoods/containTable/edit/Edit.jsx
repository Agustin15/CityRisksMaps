import styles from "./Edit.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";

export const Edit = ({ department, setEditDepartment }) => {
  const [values, setValues] = useState({ ...department });
  const [errorForm, setErrorForm] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, index, setRegisters } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.name.length == 0) {
      setErrorForm("*Debe ingresar un nombre");
      return;
    }
    setErrorForm();

    let url = "/departments/" + values.idDepartment;
    const result = await fetchPostOrPut(url, "PUT", setLoading, values);

    if (result) {
      alertSwalSuccess("¡Departamento actualizado exitosamente!");
      let url =
        "/departments/" +
        JSON.stringify({
          option: "getDepartmentsOffset",
          offset: index * 10
        });

      setRegisters(await fetchGet(url));
    }
    return;
  };

  return (
    <div className={styles.containEdit}>
      <button onClick={() => setEditDepartment(null)} className={styles.close}>
        Cerrar
      </button>
      <div className={styles.title}>
        <h3>Editar departamento {department.idDepartment}</h3>

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
            onChange={(event) =>
              setValues({ ...values, [event.target.name]: event.target.value })
            }
            maxLength={30}
            type="text"
            value={values.name}
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
