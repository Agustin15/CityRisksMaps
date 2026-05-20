import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { Form } from "./form/Form";

export const Add = ({ setAddForm }) => {
  const [values, setValues] = useState({ category: "", description: "" });
  const [errors, setErrors] = useState({ category: "", description: "" });
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, setRegisters } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errorsValues = { category: "", description: "" };

    if (values.category.length == 0) {
      errorsValues["category"] = "*Debe ingresar nombre de la categoria";
    }
    if (values.description.length == 0) {
      errorsValues["description"] = "*Debe ingresar una descripcion";
    }

    setErrors(errorsValues);

    if (
      errorsValues.category.length > 0 ||
      errorsValues.description.length > 0
    ) {
      return;
    }

    let url = "/crime/";
    const result = await fetchPostOrPut(url, "POST", setLoading, values);

    if (result) {
      alertSwalSuccess(
        "¡Registro de categoria de delito agregado exitosamente!"
      );

      url = "/crime/crimes";

      let categoryCrimes = await fetchGet(url);
      setRegisters(categoryCrimes);
      setValues({ category: "", description: "" });
    }
    return;
  };

  return (
    <div className={styles.containAdd}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar categoria de delito</h3>
        <button onClick={() => setAddForm(false)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <Form
        handleSubmit={handleSubmit}
        errors={errors}
        values={values}
        setValues={setValues}
        loading={loading}
      />
    </div>
  );
};
