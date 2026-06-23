import styles from "./Form.module.css";
import { LoadNeighborhoods } from "../../add/loadNeighborhoods/LoadNeighborhoods";
import { useState } from "react";

export const Form = ({ handleSubmit, loading, values, setValues, errors }) => {
  const [neighborhoods, setNeighborhoods] = useState();

  return (
    <form className={styles.formEdit} onSubmit={(event) => handleSubmit(event)}>
      <LoadNeighborhoods
        errors={errors}
        values={values}
        setValues={setValues}
        neighborhoods={neighborhoods}
        setNeighborhoods={setNeighborhoods}
      />

      <div className={styles.columnInput}>
        <label>Cantidad de habitantes:</label>

        <input
          autoComplete="off"
          placeholder="Ingrese habitantes"
          name="quantity"
          onChange={(event) =>
            setValues({
              ...values,
              [event.target.name]: event.target.value.trim()
            })
          }
          maxLength={8}
          type="text"
          value={values.quantity}
        ></input>
        {errors.quantity && <p>{errors.quantity}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Año:</label>
        <input
          autoComplete="off"
          placeholder="Ingrese año"
          name="year"
          onChange={(event) =>
            setValues({
              ...values,
              [event.target.name]: event.target.value.trim()
            })
          }
          maxLength={4}
          type="text"
          value={values.year}
        ></input>
        {errors.year && <p>{errors.year}</p>}
      </div>

      <button
        disabled={loading || !neighborhoods}
        className={
          loading || !neighborhoods ? styles.saveDisabled : styles.save
        }
        type="submit"
      >
        {loading ? "Actualizando.." : "Actualizar"}
      </button>
    </form>
  );
};
