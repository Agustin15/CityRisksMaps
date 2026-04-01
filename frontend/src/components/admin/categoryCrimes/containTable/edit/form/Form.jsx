import styles from "./Form.module.css";

export const Form = ({
  handleSubmit,
  error,
  description,
  setDescription,
  loading
}) => {
  return (
    <form className={styles.formEdit} onSubmit={(event) => handleSubmit(event)}>
      <div className={styles.columnInput}>
        <label>Descripcion:</label>
        <textarea
          autoComplete="off"
          name="description"
          onChange={(event) => setDescription(event.target.value)}
          maxLength={700}
          placeholder="Ingrese descripcion"
          value={description}
        ></textarea>
        {error && <p>{error}</p>}
      </div>

      <button disabled={loading} className={styles.save} type="submit">
        {loading ? "Actualizando..." : "Actualizar"}
      </button>
    </form>
  );
};
