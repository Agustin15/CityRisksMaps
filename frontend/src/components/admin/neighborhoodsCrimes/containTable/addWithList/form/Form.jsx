import styles from "./Form.module.css";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext.jsx";
import { useAddNeighborhoodCrime } from "../../../../../../contexts/adminContext/AddNeighborhoodCrimeContext";
import { UploadFile } from "../uploadFile/UploadFile";
import { LoadNeighborhoods } from "../loadNeighborhoods/LoadNeighborhoods";
import { fetchGetNeighborhoodsCrimeFromFile, validation } from "./functions.js";

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
    setNeighborhoodsSelected,
    loading,
    loadingFromFile,
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

      <div className={styles.columnOne}>
        <div className={styles.columnInput}>
          <label>Año:</label>
          <input
            autoComplete="off"
            name="year"
            onChange={(event) =>
              setValues({ ...values, ["year"]: event.target.value })
            }
            maxLength={4}
            placeholder="Ingrese año para filtrar los delitos"
            value={values.year}
          ></input>
          {errors && <p>{errors.year}</p>}
        </div>

        <div className={styles.columnInput}>
          <label>Categoria de delito:</label>
          <select
            defaultValue={values.crime}
            onChange={(event) =>
              setValues({ ...values, ["crime"]: event.target.value })
            }
            name="crime"
          >
            {crimes.map((crime, index) => (
              <option key={index} value={crime.category}>
                {crime.category}
              </option>
            ))}
          </select>
          {errors.crime && <p>{errors.crime}</p>}
        </div>

        <UploadFile values={values} setValues={setValues} errors={errors} />

        <button
          onClick={() => handleLoadCrimesFromFile()}
          disabled={loadingFromFile || neighborhoods.length == 0}
          className={
            loadingFromFile || neighborhoods.length == 0
              ? styles.loadDisabled
              : styles.load
          }
          type="button"
        >
          {loadingFromFile ? "Cargando..." : "Cargar informacion"}
        </button>
      </div>
    </form>
  );
};
