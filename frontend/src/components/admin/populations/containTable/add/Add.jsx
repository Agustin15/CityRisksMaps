import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useParams } from "react-router";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { Form } from "./form/Form.jsx";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { defineEndpointToRefreshDataAfterChanges } from "../functions.js";
import { validationForm } from "../functions.js";

export const Add = ({ setAddForm }) => {
  const [values, setValues] = useState({
    nameNeighborhood: "Seleccionar",
    quantity: "",
    year: ""
  });
  const [errors, setErrors] = useState({
    nameNeighborhood: "",
    quantity: "",
    year: ""
  });

  const [loading, setLoading] = useState(false);

  const {
    fetchPostOrPut,
    fetchGet,
    index,
    setRegisters,
    pages,
    setPages,
    years,
    loadYears,
    setYearSelected,
    yearSelected
  } = useCrud();

  const params = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsValues = validationForm(values);
    setErrors(errorsValues);
    if (Object.values(errorsValues).find((value) => value.length > 0)) return;

    let url = "/population/";
    const result = await fetchPostOrPut(url, "POST", setLoading, values);

    if (result) {
      setValues({
        nameNeighborhood: null,
        quantity: "",
        year: ""
      });
      alertSwalSuccess("¡Registro de poblacion agregado exitosamente!");

      if (!years.find((year) => year == parseInt(values.year))) {
        await loadYears("/population/", "getPopulationsYears");
        url = defineEndpointToRefreshDataAfterChanges(0, params, values.year);
        setYearSelected(values.year);
      } else {
        url = defineEndpointToRefreshDataAfterChanges(
          index,
          params,
          yearSelected
        );
      }

      let populations = await fetchGet(url);
      if (populations) {
        setRegisters(populations.registersOffset);
        if (populations.pages != pages) setPages(populations.pages);
      } else setRegisters();
    }

    return;
  };

  return (
    <div className={styles.containAdd}>
      <button onClick={() => setAddForm(false)} className={styles.close}>
        Cerrar
      </button>
      <div className={styles.title}>
        <h3>Agregar poblacion</h3>
        <div className={styles.backgroundIcon}>
          <img src={iconAdd}></img>
        </div>
      </div>

      <Form
        handleSubmit={handleSubmit}
        loading={loading}
        values={values}
        setValues={setValues}
        errors={errors}
      />
    </div>
  );
};
