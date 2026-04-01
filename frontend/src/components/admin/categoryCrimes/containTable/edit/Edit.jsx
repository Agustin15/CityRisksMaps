import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { Form } from "./form/Form";

export const Edit = ({ crime, setEditCrime }) => {
  const [description, setDescription] = useState(crime.description);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, setRegisters } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError();

    if (description.length == 0) {
      setError("*Debe ingresar una description de la categoria");
      return;
    }

    let url = "/crimeAdmin/" + encodeURIComponent(crime.category);

    const result = await fetchPostOrPut(url, "PUT", setLoading, {
      description
    });

    if (result) {
      alertSwalSuccess(
        "¡Registro de categoria de delito actualizado exitosamente!"
      );

      let url = "/crimeAdmin/crimes";

      let categoryCrimes = await fetchGet(url);
      setRegisters(categoryCrimes);
      setDescription("");
    }
    return;
  };

  return (
    <div className={styles.containEdit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar categoria {crime.category} </h3>
        <button onClick={() => setEditCrime(null)} className={styles.close}>
          Cerrar
        </button>
      </div>
      <Form
        handleSubmit={handleSubmit}
        error={error}
        description={description}
        setDescription={setDescription}
        loading={loading}
      />
    </div>
  );
};
