import styles from "./SecondColumn.module.css";
import iconInfo from "../../../../../../../assets/img/informationAdd.png";
import { useAddNeighborhoodCrime } from "../../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";
import { useCrud } from "../../../../../../../contexts/adminContext/CrudContext";
import { Modal } from "../../../../../modal/Modal";
import { createPortal } from "react-dom";

export const SecondColumn = ({ neighborhoods }) => {
  const { values, setValues, errors } = useAddNeighborhoodCrime();
  const { crimes } = useCrud();

  return (
    <div className={styles.secondColumn}>
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

      <div className={styles.info}>
        <img src={iconInfo}></img>
        <p>
          Si no se selecciona ningun barrio, se agregaran los datos a partir del
          archivo fuente CSV de AECA
        </p>
      </div>
    </div>
  );
};
