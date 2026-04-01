import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { Form } from "../add/form/Form";
import { ButtonEditSubmit } from "./buttonEditSubmit/ButtonEditSubmit";
import { validationForm } from "../functions.js";

export const Edit = ({ user, setEditUser }) => {
  const [values, setValues] = useState({
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    idRol: user.rol
  });

  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    email: "",
    idRol: ""
  });
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, setRegisters, index } = useCrud();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({
      name: "",
      lastname: "",
      email: "",
      idRol: ""
    });

    const errorValues = validationForm(values);

    if (Object.values(errorValues).find((value) => value.length > 0)) {
      setErrors(errorValues);
      return;
    }

    let url = "/user/" + user.idUser;
    const result = await fetchPostOrPut(url, "PUT", setLoading, values);

    let msj = "¡Registro de usuario actualizado exitosamente!";

    if (result) {
      alertSwalSuccess(msj);

      url = "/user/usersOffset/" + index * 10;

      let users = await fetchGet(url);

      setRegisters(users.registersOffset);
    }
    return;
  };

  return (
    <div className={styles.containEdit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar usuario</h3>
        <button onClick={() => setEditUser(null)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <Form
        handleSubmit={handleSubmit}
        errors={errors}
        values={values}
        setValues={setValues}
        loading={loading}
        ButtonSubmit={ButtonEditSubmit}
      />
    </div>
  );
};
