import styles from "./Form.module.css";

export const Form = ({ handleSubmit, errors, values, setValues, loading }) => {
  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <div className={styles.columnInput}>
        <label>Categoria:</label>
        <input
          autoComplete="off"
          name="category"
          onChange={(event) =>
            setValues({ ...values, ["category"]: event.target.value })
          }
          maxLength={20}
          placeholder="Ingrese nombre de categoria"
          type="text"
          value={values.category}
        ></input>
        {errors.category && <p>{errors.category}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Descripcion:</label>
        <textarea
          autoComplete="off"
          name="description"
          onChange={(event) =>
            setValues({ ...values, ["description"]: event.target.value })
          }
          maxLength={700}
          placeholder="Ingrese descripcion"
          value={values.description}
        ></textarea>
        {errors.description && (
          <p className={styles.errorDescription}>{errors.description}</p>
        )}
      </div>

      <button disabled={loading} className={styles.add} type="submit">
        {loading ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
};
