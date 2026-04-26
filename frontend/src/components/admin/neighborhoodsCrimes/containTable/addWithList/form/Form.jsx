import styles from "./Form.module.css";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";
import { useEffect, useState } from "react";
import { UploadFile } from "../uploadFile/UploadFile";
import { LoadNeighborhoods } from "../loadNeighborhoods/LoadNeighborhoods";
import { useAddNeighborhoodCrime } from "../../../../../../contexts/adminContext/AddNeighborhoodCrimeContext";

export const Form = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [neighborhoodsSelected, setNeighborhoodsSelected] = useState([]);
  const { crimes } = useCrud();
  const { handleSubmit, errors, values, setValues, loading } =
    useAddNeighborhoodCrime();

  useEffect(() => {
    if (neighborhoods.length == 0) return;

    values.neighborhoodsSelected = neighborhoods.map((neighborhood) => {
      return { neighborhood: neighborhood.name, checked: false };
    });
  }, [neighborhoods]);
  
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
          disabled={loading || neighborhoods.length == 0}
          className={
            loading || neighborhoods.length == 0
              ? styles.addDisabled
              : styles.add
          }
          type="submit"
        >
          {loading ? "Cargando..." : "Cargar informacion"}
        </button>
      </div>
    </form>
  );
};
