import styles from "./Form.module.css";
import iconResetPassword from "../../../../assets/img/resetPassword.png";
import iconChangeEmail from "../../../../assets/img/changeEmail.png";
import { useState } from "react";
import { useAuth } from "../../../../contexts/adminContext/AuthContext";
import { createPortal } from "react-dom";
import { ResetPassword } from "../resetPassword/ResetPassword";
import { Modal } from "../../modal/Modal";
import { Options } from "./options/Options.jsx";
import { CompleteName } from "./completeName/CompleteName";
import { UpdateEmail } from "./updateEmail/UpdateEmail.jsx";
import { alertSwalSuccess } from "../../../sweetAlert/sweetAlert";
import { fetchUpdateCompleteName } from "./functions.js";

export const Form = ({ user }) => {
  const [values, setValues] = useState({
    name: user.name,
    lastname: user.lastname
  });

  const [errors, setErrors] = useState({
    name: values.name.length > 0 ? "" : "Nombre no puede estar vacio",
    lastname: values.lastname.length > 0 ? "" : "Apellido no puede estar vacio"
  });
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const { setUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(errors).some((error) => error.length > 0)) return;

    const result = await fetchUpdateCompleteName(
      setLoading,
      setUser,
      values,
      user.idUser
    );

    if (result) {
      alertSwalSuccess("¡Usuario actualizado exitosamente!");
      setUser({ ...user, name: values.name, lastname: values.lastname });
    }
  };

  return (
    <>
      <div className={styles.containForm}>
        <div className={styles.tab}>
          <span>Editar</span>
        </div>
        <form onSubmit={(event) => handleSubmit(event)}>
          <CompleteName
            errors={errors}
            setErrors={setErrors}
            values={values}
            setValues={setValues}
          />
          <div className={styles.columnInputEmail}>
            <label>Email:</label>
            <input
              readOnly
              value={user.email}
              placeholder="Correo"
              type="email"
            ></input>
            <button onClick={() => setChangeEmail(true)} type="button">
              Actualizar
              <img src={iconChangeEmail}></img>
            </button>
          </div>

          <div className={styles.columnInputPassword}>
            <label>Contraseña:</label>
            <input
              readOnly
              value={"*************************"}
              type="password"
            ></input>
            <button type="button" onClick={() => setChangePassword(true)}>
              Actualizar
              <img src={iconResetPassword}></img>
            </button>
          </div>

          <Options loading={loading} values={values} />
        </form>
      </div>

      {changePassword &&
        createPortal(
          <Modal>
            <ResetPassword setChangePassword={setChangePassword} />
          </Modal>,
          document.querySelector("body")
        )}
      {changeEmail &&
        createPortal(
          <Modal>
            <UpdateEmail setChangeEmail={setChangeEmail} />
          </Modal>,
          document.querySelector("body")
        )}
    </>
  );
};
