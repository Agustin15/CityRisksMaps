import styles from "./Options.module.css";
import { useAuth } from "../../../../../contexts/adminContext/AuthContext";
import iconReset from "../../../../../assets/img/reset.png";
import iconSave from "../../../../../assets/img/save.png";

export const Options = ({ loading, values }) => {
  const { user } = useAuth();

  const valuesWereChanged = () => {
    if (values.name != user.name || values.lastname != user.lastname)
      return true;
    return false;
  };
  
  return (
    <div className={styles.options}>
      <button
        disabled={loading || !valuesWereChanged()}
        className={valuesWereChanged() ? styles.save : styles.saveDisabled}
        type="submit"
      >
        <img src={iconSave}></img>
        {loading ? "Guardando..." : "Guardar"}
      </button>
      <button
        onClick={() => setValues({ name: user.name, lastname: user.lastname })}
        className={styles.clean}
        type="button"
      >
        <img src={iconReset}></img>
        Resetear
      </button>
    </div>
  );
};
