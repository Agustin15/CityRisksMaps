const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./LoadDepartaments.module.css";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export const LoadDepartaments = ({
  errors,
  values,
  setValues,
  departments,
  setDepartments
}) => {
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [errorLoad, setErrorLoad] = useState(false);
  let navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    let params = JSON.stringify({ option: "getDepartments" });

    try {
      const response = await fetch(
        LOCALHOST_BACKEND + "/department/" + params,
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
          removeCookie("nameAndLastname");
          navigate("/admin/login");
        } else throw new Error(result.messageError);
      }

      result.unshift({ name: "Seleccionar", idDepartment: null });
      setDepartments(result);
    } catch (error) {
      setErrorLoad(error.message);
    } finally {
      setLoadingDepartments(false);
    }
  };

  return (
    <div className={styles.columnInput}>
      <label>Departamentos:</label>
      {loadingDepartments == true && (
        <p className={styles.loading}>Cargando departamentos...</p>
      )}
      {loadingDepartments == false && !departments && (
        <p className={styles.errorLoad}>{errorLoad}</p>
      )}

      {loadingDepartments == false && departments && (
        <select
          onChange={(event) =>
            setValues({ ...values, ["idDepartment"]: event.target.value })
          }
          name="idDepartment"
        >
          {departments.map((department) => (
            <option value={department.idDepartment}>{department.name}</option>
          ))}
        </select>
      )}

      {errors.idDepartment && <p>{errors.idDepartment}</p>}
    </div>
  );
};
