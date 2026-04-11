import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { Form } from "./form/Form";

export const Add = ({ setAddForm }) => {
  const [loading, setLoading] = useState(false);
  const {
    fetchPostWithFormData,
    fetchGet,
    crimes,
    setRegisters,
    crimeSelected,
    yearSelected,
    loadYears
  } = useCrud();

  const [values, setValues] = useState({
    file: null,
    crime: crimes[0].category,
    year: ""
  });
  const [errors, setErrors] = useState({
    file: "",
    crime: "",
    year: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errorsValues = {
      file: "",
      crime: "",
      year: ""
    };

    if (values.crime.length == 0) {
      errorsValues["crime"] = "*Debe ingresar categoria de crimen";
    }
    if (values.year.length == 0) {
      errorsValues["year"] = "*Debe ingresar el año";
    }
    if (!values.file) {
      errorsValues["file"] = "*Debe indicar un archivo";
    }

    setErrors(errorsValues);

    if (Object.values(errorsValues).find((error) => error.length > 0)) {
      return;
    }

    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("department", "Montevideo");
    formData.append("crime", values.crime);
    formData.append("year", values.year);
    formData.append("optionAdd", "addThroughtFile");

    const result = await fetchPostWithFormData(
      "/neighborhoodCrimeAdmin/",
      setLoading,
      formData
    );

    if (result) {
      alertSwalSuccess("¡Registros de denuncias agregados exitosamente!");

      let url;
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
        file: null,
        crime: "",
        year: ""
      });
    }
    return;
  };

  return (
    <div className={styles.containAdd}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar denuncias de delitos de barrios</h3>
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
