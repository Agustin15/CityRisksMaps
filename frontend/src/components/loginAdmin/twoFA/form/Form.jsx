import styles from "./Form.module.css";
import { useTwoStepAuth } from "../../../../contexts/adminContext/TwoStepAuthContext";
import { Keyboard } from "../keyboard/Keyboard";

export const Form = () => {
  const { error, refInput, code, loadingForm } = useTwoStepAuth();

  return (
    <form className={styles.form}>
      <div className={styles.columnInput}>
        <label>Ingresar codigo:</label>
        <input
          ref={refInput}
          value={code}
          onKeyDown={(event) => event.preventDefault()}
          inputMode="numeric"
          type="password"
          placeholder="* * * * * *"
        ></input>
        {error.length > 0 && <p className={styles.msjError}>{error}</p>}

        <Keyboard />
      </div>

      {loadingForm && <span className={styles.loader}>Cargando...</span>}
    </form>
  );
};
