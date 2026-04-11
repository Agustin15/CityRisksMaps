import styles from "./AddWithList.module.css";
import iconAdd from "../../../../../assets/img/addWithList.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { validationForm } from "../functions.js";
import { Form } from "./form/Form";

export const AddWithList = ({ setAddWithListForm }) => {
  const [loading, setLoading] = useState(false);
  const {
    fetchPostOrPut,
    fetchGet,
    crimes,
    setRegisters,
    crimeSelected,
    yearSelected,
    loadYears
  } = useCrud();

  const [values, setValues] = useState({
    neighborhoodsCrime: [],
    crime: crimes[0].category,
    year: ""
  });
  const [errors, setErrors] = useState({
    neighborhoodsCrime: "",
    crime: "",
    year: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsValues = validationForm(values);
    setErrors(errorsValues);

    if (Object.values(errorsValues).find((error) => error.length > 0)) {
      return;
    }

    values.optionAdd = "addThroughtList";
    const result = await fetchPostOrPut(
      "/neighborhoodCrimeAdmin/",
      "POST",
      setLoading,
      values
    );

    if (result) {
      alertSwalSuccess("¡Registros de denuncias agregados exitosamente!");

      let url;

      if (values.crime == crimeSelected) {
        if (values.year != yearSelected) {
          await loadYears("/neighborhoodCrimeAdmin/yearsNeighborhoodsCrimes");
          url = "/neighborhoodCrimeAdmin/" + crimeSelected + "/" + values.year;
        } else {
          url = "/neighborhoodCrimeAdmin/" + crimeSelected + "/" + yearSelected;
        }

        let nhCrimes = await fetchGet(url);
        document.querySelector("form").reset();
        setRegisters(nhCrimes);
        setValues({
          neighborhoodsCrime: values.neighborhoodsCrime.map(
            (neighborhoodCrime) => ({
              ...neighborhoodCrime,
              amount: null
            })
          ),
          crime: "",
          year: ""
        });
      }
    }
    return;
  };

  return (
    <div className={styles.containAdd}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar denuncias de delitos de barrios</h3>
        <button
          onClick={() => setAddWithListForm(false)}
          className={styles.close}
        >
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
