import styles from "./ButtonEditSubmit.module.css";

export const ButtonEditSubmit = ({ loading, rols }) => {
  return (
    <button
      disabled={loading || !rols}
      className={rols ? styles.save : styles.saveDisabled}
      type="submit"
    >
      {loading ? "Actualizando..." : "Actualizar"}
    </button>
  );
};
