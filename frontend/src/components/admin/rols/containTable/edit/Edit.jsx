import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { Form } from "./form/Form";

export const Edit = ({ role, setEditRole }) => {
  const [name, setName] = useState(role.name);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, setRegisters } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError();

    if (name.length == 0) {
      setError("*Debe ingresar nombre del rol");
      return;
    }

    let url = "/role/" + role.idRol;

    const result = await fetchPostOrPut(url, "PUT", setLoading, {
      name
    });

    if (result) {
      alertSwalSuccess("¡Registro de rol actualizado exitosamente!");

      let url = "/role/allRols";

      setName("");
      let rols = await fetchGet(url);
      setRegisters(rols);
    }
    return;
  };

  return (
    <div className={styles.containEdit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar rol {role.name}</h3>
        <button onClick={() => setEditRole(null)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <Form
        handleSubmit={handleSubmit}
        error={error}
        name={name}
        setName={setName}
        loading={loading}
      />
    </div>
  );
};
