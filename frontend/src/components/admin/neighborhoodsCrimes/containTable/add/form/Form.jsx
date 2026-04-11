import styles from "./Form.module.css";
import iconUpload from "../../../../../../assets/img/upload.png";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";

export const Form = ({ handleSubmit, errors, values, setValues, loading }) => {
  const { crimes } = useCrud();
  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <div className={styles.columnInput}>
        <label htmlFor="file">Datos a partir de archivo CSV:</label>

        <label htmlFor="file">
          <button
            type="button"
            accept=".csv, text/csv"
            className={styles.btnUpload}
          >
            {values.file ? "Archivo " + values.file.name : "Subir"}
            <img src={iconUpload}></img>
          </button>
        </label>
        <input
          id="file"
          autoComplete="off"
          name="file"
          onChange={(event) =>
            setValues({ ...values, ["file"]: event.target.files[0] })
          }
          type="file"
        ></input>

        {errors && <p>{errors.file}</p>}
      </div>

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
          {crimes.map((crime,index) => (
            <option key={index} value={crime.category}>{crime.category}</option>
          ))}
        </select>
        {errors.crime && <p>{errors.crime}</p>}
      </div>

      <button disabled={loading} className={styles.add} type="submit">
        {loading ? "Cargando..." : "Cargar informacion"}
      </button>
    </form>
  );
};
