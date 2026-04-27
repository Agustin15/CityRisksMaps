import styles from "./Form.module.css";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext.jsx";
import { useAddNeighborhoodCrime } from "../../../../../../contexts/adminContext/AddNeighborhoodCrimeContext";
import { UploadFile } from "../uploadFile/UploadFile";
import { LoadNeighborhoods } from "../loadNeighborhoods/LoadNeighborhoods";
import { fetchGetNeighborhoodsCrimeFromFile, validation } from "./functions.js";
import { SecondColumn } from "./secondColumn/SecondColumn.jsx";

export const Form = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const { crimes } = useCrud();
  const { setUser } = useAuth();

  const {
    handleSubmit,
    setErrors,
    errors,
    values,
    setValues,
    neighborhoodsSelected,
    fetchGetNeighborhoodsCrimeFromFile,
    setLoadingFromFile
  } = useAddNeighborhoodCrime();

  const handleLoadCrimesFromFile = async () => {
    let selectedNeighborhoods = neighborhoodsSelected.filter(
      (neighborhood) => neighborhood.checked == true
    );

    if (selectedNeighborhoods.length > 0) {
      selectedNeighborhoods = selectedNeighborhoods.map(
        (hood) => hood.neighborhood
      );
    }

    const valuesLoadFile = {
      file: values.file,
      department: "Montevideo",
      crime: values.crime,
      year: values.year,
      neighborhoodsSelected: selectedNeighborhoods
    };

    const errorsValues = validation(valuesLoadFile);
    setErrors(errorsValues);

    if (Object.values(errorsValues).some((error) => error.length > 0)) {
      return;
    }

    const result = await fetchGetNeighborhoodsCrimeFromFile(
      setLoadingFromFile,
      valuesLoadFile,
      setUser
    );

    if (result) {
      setValues({ ...values, neighborhoodsCrime: result });
    }
  };

  return (
    <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
      <div className={styles.columnNeighborhoods}>
        <label className={styles.lblNeighborhoodsCrime}>
          Cantidad de denuncias en barrios:
        </label>

        <LoadNeighborhoods
          neighborhoods={neighborhoods}
          setNeighborhoods={setNeighborhoods}
        />
        {errors && (
          <p className={styles.errorNeighborhoodsCrime}>
            {errors.neighborhoodsCrime}
          </p>
        )}
      </div>

      <SecondColumn
        neighborhoods={neighborhoods}
        handleLoadCrimesFromFile={handleLoadCrimesFromFile}
      />
    </form>
  );
};
