import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useParams } from "react-router";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { LoadDepartaments } from "./loadDepartments/LoadDepartments";
import { defineEndpointToRefreshDataAfterChanges } from "../functions.js";
import { validationForm } from "../functions.js";

export const Add = ({ setAddForm }) => {
  const [values, setValues] = useState({ name: "", idDepartment: 0 });
  const [errors, setErrors] = useState({ name: "", idDepartment: "" });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState();
  const { fetchPostOrPut, fetchGet, index, setRegisters, pages, setPages } =
    useCrud();
  const params = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsValues = validationForm(values);
    setErrors(errorsValues);
    if (Object.values(errorsValues).find((value) => value.length > 0)) return;

    let url = "/neighborhood/";
    const result = await fetchPostOrPut(url, "POST", setLoading, values);

    if (result) {
      alertSwalSuccess("¡Registro de barrio agregado exitosamente!");

      let url = defineEndpointToRefreshDataAfterChanges(index, params);

      let neighborhoods = await fetchGet(url);
      if (neighborhoods) {
        setRegisters(neighborhoods.registersOffset);
        if (neighborhoods.pages != pages) setPages(neighborhoods.pages);

        setValues({ name: "", idDepartment: 0 });
      }
    }
    return;
  };

  return (
    <div className={styles.containAdd}>
      <button onClick={() => setAddForm(false)} className={styles.close}>
        Cerrar
      </button>
      <div className={styles.title}>
        <h3>Agregar barrio</h3>
        <div className={styles.backgroundIcon}>
          <img src={iconAdd}></img>
        </div>
      </div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className={styles.columnInput}>
          <label>Nombre:</label>
          <input
            autoComplete="off"
            placeholder="Ingrese nombre"
            name="name"
            onChange={(event) =>
              setValues({
                ...values,
                [event.target.name]: event.target.value.trim()
              })
            }
            maxLength={30}
            type="text"
            value={values.name}
          ></input>
          {errors.name && <p>{errors.name}</p>}
        </div>

        <LoadDepartaments
          errors={errors}
          values={values}
          setValues={setValues}
          departments={departments}
          setDepartments={setDepartments}
        />

        <button
          disabled={loading || !departments}
          className={loading || !departments ? styles.addDisabled : styles.add}
          type="submit"
        >
          {loading ? "Agregando..." : "Agregar"}
        </button>
      </form>
    </div>
  );
};
