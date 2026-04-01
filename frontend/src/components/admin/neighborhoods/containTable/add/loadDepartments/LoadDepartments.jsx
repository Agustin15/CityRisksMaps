const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./LoadDepartaments.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext";

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
  const { setUser } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await fetch(
        LOCALHOST_BACKEND + "/department/allDepartments",
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

      result.unshift({ idDepartment: 0, name: "Seleccionar" });
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
          defaultValue={values.idDepartment}
          onChange={(event) =>
            setValues({ ...values, ["idDepartment"]: event.target.value })
          }
          name="idDepartment"
        >
          {departments.map((department, index) => (
            <option key={index} value={department.idDepartment}>
              {department.name}
            </option>
          ))}
        </select>
      )}

      {errors.idDepartment && <p>{errors.idDepartment}</p>}
    </div>
  );
};
