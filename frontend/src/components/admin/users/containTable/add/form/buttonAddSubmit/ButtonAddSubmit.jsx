import styles from "./ButtonAddSubmit.module.css";

export const ButtonAddSubmit = ({ loading, rols }) => {
  return (
    <button
      disabled={loading || !rols}
      className={rols ? styles.add : styles.addDisabled}
      type="submit"
    >
      {loading ? "Agregando..." : "Agregar"}
    </button>
  );
};
