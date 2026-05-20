const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./LoadNeighborhoods.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext";
import { useNavigate } from "react-router";

export const LoadNeighborhoods = ({
  errors,
  values,
  setValues,
  neighborhoods,
  setNeighborhoods
}) => {
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [errorLoad, setErrorLoad] = useState(false);
  let navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await fetch(
        LOCALHOST_BACKEND + "/admin/neighborhood/allNeighborhoods",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          setUser();
          navigate("/admin/login");
        } else throw new Error(result.messageError);
      }

      result.unshift({ idNeighborhood: 0, name: "Seleccionar" });
      setNeighborhoods(result);
    } catch (error) {
      setErrorLoad(error.message);
    } finally {
      setLoadingNeighborhoods(false);
    }
  };

  return (
    <div className={styles.columnInput}>
      <label>Selecciona barrio:</label>
      {loadingNeighborhoods == true && (
        <p className={styles.loading}>Cargando barrios...</p>
      )}
      {loadingNeighborhoods == false && !neighborhoods && (
        <p className={styles.errorLoad}>{errorLoad}</p>
      )}

      {loadingNeighborhoods == false && neighborhoods && (
        <select
          defaultValue={values.nameNeighborhood}
          onChange={(event) =>
            setValues({ ...values, ["nameNeighborhood"]: event.target.value })
          }
          name="nameNeighborhood"
        >
          {neighborhoods.map((neighborhood, index) => (
            <option key={index} value={neighborhood.name}>
              {neighborhood.name}
            </option>
          ))}
        </select>
      )}

      {errors.nameNeighborhood && <p>{errors.nameNeighborhood}</p>}
    </div>
  );
};
