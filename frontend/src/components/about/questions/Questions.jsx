import styles from "./Questions.module.css";
import iconFormQuestions from "../../../assets/img/formQuestions.png";
import { useState } from "react";
import { fetchSendEmail, validationForm } from "./functions.js";
import toast, { Toaster } from "react-hot-toast";

export const Questions = () => {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const sendForm = async (event) => {
    event.preventDefault();
    const errorsValues = validationForm(event, values);
    setErrors(errorsValues);
    
    if (Object.values(errorsValues).some((value) => value.length > 0)) return;

    try {
      setLoading(true);
      await fetchSendEmail(values);
      setValues({ name: "", email: "", message: "" });
      return notifySuccess();
    } catch (error) {
      return notifyError(
        error.message || "¡Ups algo salio mal al enviar el mensaje!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const notifySuccess = () => toast.success("¡Mensaje enviado exitosamente!");
  const notifyError = (error) => toast.success(error);

  return (
    <div className={styles.questions}>
      <div className={styles.title}>
        <h3>¡Si tiene alguna consulta o sugerencia no dude en enviarnosla!</h3>
        <img src={iconFormQuestions}></img>
      </div>

      <form onSubmit={(event) => sendForm(event)}>
        <div className={styles.rowInputs}>
          <div className={styles.input}>
            <input
              autoComplete="off"
              name="name"
              value={values.name}
              onChange={(event) => handleChange(event)}
              placeholder="Ingrese nombre"
              type="text"
            ></input>
            <p>{errors.name}</p>
          </div>
          <div className={styles.input}>
            <input
              autoComplete="off"
              name="email"
              value={values.email}
              onChange={(event) => handleChange(event)}
              placeholder="Ingrese correo"
              type="text"
            ></input>
            <p>{errors.email}</p>
          </div>
        </div>
        <div className={styles.message}>
          <textarea
            autoComplete="off"
            name="message"
            value={values.message}
            onChange={(event) => handleChange(event)}
            placeholder="Mensaje..."
          ></textarea>
          <p>{errors.message}</p>
        </div>

        <button disabled={loading} type="submit">
          {loading ? "Enviando..." : "Enviar"}
        </button>
        <Toaster position="bottom-center" />
      </form>
    </div>
  );
};
