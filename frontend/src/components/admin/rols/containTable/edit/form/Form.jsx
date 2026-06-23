import styles from "./Form.module.css";

export const Form = ({ handleSubmit, error, name, setName, loading }) => {
  return (
    <form className={styles.formEdit} onSubmit={(event) => handleSubmit(event)}>
      <div className={styles.columnInput}>
        <label>Nombre del nuevo rol:</label>
        <input
          autoComplete="off"
          name="name"
          onChange={(event) => setName(event.target.value)}
          maxLength={10}
          placeholder="Ingrese rol"
          type="text"
          value={name}
        ></input>
        {error && <p>{error}</p>}
      </div>

      <button disabled={loading} className={styles.save} type="submit">
        {loading ? "Actualizando.." : "Actualizar"}
      </button>
    </form>
  );
};
