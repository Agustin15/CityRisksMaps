import styles from "./Perception.module.css";
import { handleChange } from "../../functions.js";

export const Perception = ({ valuesForm, setValuesForm }) => {
  return (
    <div className={styles.perception}>
      <label className={styles.lblTitle}>Percepcion:</label>
      <div className={styles.columnPerception}>
        <div className={styles.rowPerception}>
          <input
            onChange={(event) =>
              handleChange(event.target, valuesForm, setValuesForm)
            }
            type="radio"
            name="perception"
            value={"secure"}
          ></input>
          <label>Seguro</label>
        </div>
        <div className={styles.rowPerception}>
          <input
            onChange={(event) =>
              handleChange(event.target, valuesForm, setValuesForm)
            }
            type="radio"
            name="perception"
            value={"insecure"}
          ></input>
          <label>Inseguro</label>
        </div>
      </div>
    </div>
  );
};
