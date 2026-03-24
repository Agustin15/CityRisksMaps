import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { useState } from "react";
import { useParams } from "react-router";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { Form } from "./form/Form.jsx";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { defineEndpointToRefreshDataAfterChanges } from "../functions.js";
import { validationForm } from "../functions.js";

export const Edit = ({ population, setEditPopulation }) => {
  const [values, setValues] = useState({
    nameNeighborhood: population.nameNeighborhood,
    quantity: population.quantity,
    year: population.year
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
    years,
    setYearSelected,
    yearSelected,
    loadYears
  } = useCrud();

  const params = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsValues = validationForm(values);
    setErrors(errorsValues);

    if (Object.values(errorsValues).find((value) => value.length > 0)) return;

    let url = "/population/" + population.idPopulation;

    const result = await fetchPostOrPut(url, "PUT", setLoading, values);

    if (result) {
      alertSwalSuccess("¡Registro de poblacion actualizado exitosamente!");

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
      if (populations) setRegisters(populations.registersOffset);
      else setRegisters();
    }
    return;
  };

  return (
    <div className={styles.containEdit}>
      <button onClick={() => setEditPopulation(null)} className={styles.close}>
        Cerrar
      </button>
      <div className={styles.title}>
        <h3>
          Editar poblacion de{" "}
          {population.nameNeighborhood + " " + population.year}
        </h3>
        <div className={styles.backgroundIcon}>
          <img src={iconEdit}></img>
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
