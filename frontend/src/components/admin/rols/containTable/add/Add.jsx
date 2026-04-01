import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { Form } from "./form/Form";

export const Add = ({ setAddForm }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, setRegisters } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError();

    if (name.length == 0) {
      setError("Debe ingresar nombre del rol");
      return;
    }

    let url = "/role/";
    const result = await fetchPostOrPut(url, "POST", setLoading, {
      name: name
    });

    if (result) {
      alertSwalSuccess("¡Registro de rol agregado exitosamente!");

      let url = "/role/allRols";

      setName("");
      let rols = await fetchGet(url);
      setRegisters(rols);
    }
    return;
  };

  return (
    <div className={styles.containAdd}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar nuevo rol</h3>
        <button onClick={() => setAddForm(null)} className={styles.close}>
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
