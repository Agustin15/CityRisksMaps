import styles from "./Form.module.css";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext.jsx";
import { useAddNeighborhoodCrime } from "../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext.jsx";
import { LoadNeighborhoods } from "../../addWithList/loadNeighborhoods/LoadNeighborhoods.jsx";
import { SecondColumn } from "./secondColumn/SecondColumn.jsx";

export const Form = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const { crimes } = useCrud();
  const { setUser } = useAuth();

  const {
    handleSubmit,
    errors,
    loading,
    loadingFromFile,
    loadingSearch,
    cleanValues
  } = useAddNeighborhoodCrime();

  return (
    <form
      className={styles.form}
      onSubmit={(event) => handleSubmit(event, "PUT")}
    >
      <fieldset disabled={loading == true || loadingSearch == true}>
        <div className={styles.row}>
          <div className={styles.columnNeighborhoods}>
            <label className={styles.lblNeighborhoodsCrime}>
              Cantidad de denuncias en barrios:
            </label>

            <LoadNeighborhoods
              neighborhoods={neighborhoods}
              setNeighborhoods={setNeighborhoods}
            />
            {errors && (
              <p className={styles.errorNeighborhoodsCrime}>
                {errors.neighborhoodsCrime}
              </p>
            )}
          </div>

          <SecondColumn neighborhoods={neighborhoods} />
        </div>

        <div className={styles.options}>
          <button className={styles.btnEdit} type="submit">
            {loading ? "Actualizando datos..." : "Actualizar datos"}
          </button>

          <button
            onClick={() => cleanValues()}
            type="button"
            className={styles.btnReset}
          >
            Limpiar
          </button>
        </div>
      </fieldset>
    </form>
  );
};
