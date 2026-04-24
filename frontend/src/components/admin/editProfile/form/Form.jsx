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
import toast, { Toaster } from "react-hot-toast";
import { fetchUpdateCompleteName } from "./functions.js";

export const Form = ({ user }) => {
  const [values, setValues] = useState({
    name: user.name,
    lastname: user.lastname
  });

  const [errors, setErrors] = useState({
    name: "",
    lastname: ""
  });
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const { setUser } = useAuth();

  const notifySuccess = () =>
    toast.success("¡Usuario actualizado exitosamente!");

  const notifyError = (error) =>
    toast.success("Ups, no se pudo actualizar el usuario. " + error);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(errors).some((error) => error.length > 0)) return;

    try {
      const result = await fetchUpdateCompleteName(
        setLoading,
        setUser,
        values,
        user.idUser
      );

      if (result) {
        notifySuccess();
        setUser({ ...user, name: values.name, lastname: values.lastname });
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <>
      <div className={styles.containForm}>
        <Toaster position="top-center" />

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
