import styles from "./Form.module.css";
import { LoadNeighborhoods } from "../loadNeighborhoods/LoadNeighborhoods";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";

export const Form = ({ handleSubmit, errors, values, setValues, loading }) => {
  const { crimes } = useCrud();
  const [neighborhoods, setNeighborhoods] = useState([]);

  return (
    <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
      <div className={styles.columnNeighborhoods}>
        <label className={styles.lblNeighborhoodsCrime}>
          Cantidad de denuncias en barrios:
        </label>

        <LoadNeighborhoods
          values={values}
          setValues={setValues}
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
