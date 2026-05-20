const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import styles from "./Form.module.css";
import { useEffect, useState } from "react";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";
import { InputText } from "./InputText";

export const Form = ({
  handleSubmit,
  errors,
  values,
  setValues,
  loading,
  ButtonSubmit
}) => {
  const [rols, setRols] = useState();
  const [loadingRols, setLoadingRols] = useState(false);
  const [error, setError] = useState();
  const { failedResponse } = useCrud();

  const loadRols = async () => {
    setLoadingRols(true);

    try {
      const response = await fetch(LOCALHOST_BACKEND + "/admin/role/allRols", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        failedResponse(response, result);
      }
      result.unshift({ idRol: 0, name: "Seleccionar" });
      setRols(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingRols(false);
    }
  };

  useEffect(() => {
    loadRols();
  }, []);

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <InputText
        label={"Nombre:"}
        name={"name"}
        placeholder={"Ingrese nombre"}
        maxLength={20}
        values={values}
        setValues={setValues}
        errors={errors}
      />

      <InputText
        label={"Apellido:"}
        name={"lastname"}
        placeholder={"Ingrese apellido"}
        maxLength={20}
        values={values}
        setValues={setValues}
        errors={errors}
      />

      <InputText
        label={"Correo:"}
        name={"email"}
        placeholder={"Ingrese correo"}
        maxLength={40}
        values={values}
        setValues={setValues}
        errors={errors}
      />

      {loadingRols && <span>Cargando roles...</span>}
      {!loadingRols && !rols && <span>{error}</span>}

      {!loadingRols && rols && (
        <div className={styles.columnInput}>
          <label>Rol:</label>
          <select
            defaultValue={values.idRol}
            onChange={(event) =>
              setValues({ ...values, ["idRol"]: event.target.value })
            }
            name="idRol"
          >
            {rols.map((role) => (
              <option value={role.idRol}>{role.name}</option>
            ))}
          </select>
          {errors.idRol && <p>{errors.idRol}</p>}
        </div>
      )}

      <ButtonSubmit loading={loading} rols={rols} />
    </form>
  );
};
