import styles from "./add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { useState } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { alertSwalSuccess } from "../../../../sweetAlert/sweetAlert";
import { Form } from "./form/Form";
import { ButtonAddSubmit } from "./form/buttonAddSubmit/ButtonAddSubmit";
import { validationForm } from "../functions.js";

export const Add = ({ setAddForm }) => {
  const [values, setValues] = useState({
    name: "",
    lastname: "",
    email: "",
    idRol: 0
  });

  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    email: "",
    idRol: ""
  });
  const [loading, setLoading] = useState(false);
  const { fetchPostOrPut, fetchGet, setRegisters, index, pages, setPages } =
    useCrud();

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

    let url = "/user/";
    const result = await fetchPostOrPut(url, "POST", setLoading, values);

    let msj =
      "¡Registro de usuario agregado exitosamente!," +
      "se ha enviado un correo de activación al nuevo usuario ";

    if (result) {
      alertSwalSuccess(msj);

      url = "/user/usersOffset/" + index * 10;

      let users = await fetchGet(url);
      setRegisters(users.registersOffset);
      if (pages != users.pages) setPages(users.pages);

      setValues({
        name: "",
        lastname: "",
        email: "",
        idRol: 0
      });
    }
    return;
  };

  return (
    <div className={styles.containAdd}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar nuevo usuario</h3>
        <button onClick={() => setAddForm(null)} className={styles.close}>
          Cerrar
        </button>
      </div>

      <Form
        handleSubmit={handleSubmit}
        errors={errors}
        values={values}
        setValues={setValues}
        loading={loading}
        ButtonSubmit={ButtonAddSubmit}
      />
    </div>
  );
};
