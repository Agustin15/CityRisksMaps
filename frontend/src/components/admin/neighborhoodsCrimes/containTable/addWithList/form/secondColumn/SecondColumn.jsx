import styles from "./SecondColumn.module.css";
import { useAddNeighborhoodCrime } from "../../../../../../../contexts/adminContext/AddNeighborhoodCrimeContext";
import { useCrud } from "../../../../../../../contexts/adminContext/CrudContext";
import { UploadFile } from "../../uploadFile/UploadFile";

export const SecondColumn = ({ neighborhoods, handleLoadCrimesFromFile }) => {
  const { values, setValues, errors, loadingFromFile } =
    useAddNeighborhoodCrime();
  const { crimes } = useCrud();

  <div className={styles.secondColumn}>
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
  </div>;
};
