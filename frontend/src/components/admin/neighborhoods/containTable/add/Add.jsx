import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { LoadDepartaments } from "./loadDepartments/LoadDepartments";

export const Add = ({ setAddForm }) => {
  const [values, setValues] = useState({ name: "", idDepartment: null });
  const [errors, setErrors] = useState({ name: "", idDepartment: "" });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState();
  const {
    fetchPostOrPut,
    fetchGet,
    index,
    setRegisters,
    registers,
    setPages,
    pages
  } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ name: "", idDepartment: "" });

    if (values.name.length == 0) {
      setErrors({ ...errors, ["name"]: "*Debe ingresar un nombre" });
      return;
    }
    if (values.idDepartment == null) {
      setErrors({
        ...errors,
        ["idDepartment"]: "*Debe seleccionar un departamento"
      });
      return;
    }

    let url = "/neighborhood/";
    const result = await fetchPostOrPut(url, "POST", setLoading, values);

    if (result) {
      alertSwalSuccess("¡Barrio agregado exitosamente!");

      let url =
        "/neighborhood/" +
        JSON.stringify({
          option: "getNeighborhoodsOffset",
          offset: index * 10
        });

      let neighborhoods = await fetchGet(url);
      if (neighborhoods) {
        if (registers.length == 10) setPages(pages + 1);
        setRegisters(neighborhoods);
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
              setValues({ ...values, [event.target.name]: event.target.value })
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
          className={styles.add}
          type="submit"
        >
          {loading ? "Agregando..." : "Agregar"}
        </button>
      </form>
    </div>
  );
};
