import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { useState } from "react";
import { useParams } from "react-router";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { LoadDepartaments } from "../add/loadDepartments/LoadDepartments";
import { validationForm } from "../functions.js";

export const Edit = ({ neighborhood, setEditNeighborhood }) => {
  const [values, setValues] = useState({
    name: neighborhood.nameNeighborhood,
    idDepartment: neighborhood.idDepartment
  });
  const [errors, setErrors] = useState({ name: "", idDepartment: "" });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState();
  const { fetchPostOrPut, fetchGet, index, setRegisters } = useCrud();
  const params = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsValues = validationForm(values);
    setErrors(errorsValues);
    if (Object.values(errorsValues).find((value) => value.length > 0)) return;

    let url = "/neighborhood/" + neighborhood.idNeighborhood;
    const result = await fetchPostOrPut(url, "PUT", setLoading, values);

    if (result) {
      alertSwalSuccess("¡Registro de barrio actualizado exitosamente!");

      let url = "/neighborhood/neighborhoodsOffset/" + index * 10;

      let neighborhoods = await fetchGet(url);
      if (neighborhoods) {
        setRegisters(neighborhoods.registersOffset);
      }
    }
    return;
  };

  return (
    <div className={styles.containEdit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar datos de {neighborhood.nameNeighborhood}</h3>
        <button
          onClick={() => setEditNeighborhood(null)}
          className={styles.close}
        >
          Cerrar
        </button>
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
          className={
            loading || !departments ? styles.saveDisabled : styles.save
          }
          type="submit"
        >
          {loading ? "Actualizando.." : "Actualizar"}
        </button>
      </form>
    </div>
  );
};
