import styles from "./SecondColumn.module.css";
import { useAddNeighborhoodCrime } from "../../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";
import { useCrud } from "../../../../../../../contexts/adminContext/CrudContext";
import { UploadFile } from "./uploadFile/UploadFile";
import { LoadingFromFile } from "../loading/LoadingFromFile";
import { Modal } from "../../../../../modal/Modal";
import { createPortal } from "react-dom";

export const SecondColumn = ({ neighborhoods }) => {
  const {
    values,
    setValues,
    errors,
    loadingFromFile,
    handleLoadCrimesFromFile
  } = useAddNeighborhoodCrime();
  const { crimes } = useCrud();

  return (
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

      <UploadFile />

      {loadingFromFile &&
        createPortal(
          <Modal>
            <LoadingFromFile crime={values.crime} />
          </Modal>,
          document.body
        )}

      <button
        onClick={() => handleLoadCrimesFromFile()}
        className={styles.load}
        type="button"
      >
        Cargar informacion
      </button>
    </div>
  );
};
