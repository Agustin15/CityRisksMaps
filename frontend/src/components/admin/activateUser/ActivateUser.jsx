import styles from "./activateUser.module.css";
import iconActivate from "../../../assets/img/activateUser.png";
import iconLogo from "../../../assets/img/logo.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Passwords } from "./Passwords";
import { alertSwalConfirmRedirectionToLogin } from "../../sweetAlert/sweetAlert.js";
import {
  fetchActivate,
  fetchValidateToken,
  validationForm
} from "./functions.js";
import { Error401 } from "../../error401/Error401";

export const ActivateUser = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loadingValidation, setLoadingValidation] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [errorForm, setErrorForm] = useState();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
    repeatPassword: ""
  });

  useEffect(() => {
    if (params.token) {
      fetchValidateToken(setLoadingValidation, params.token, setValidToken);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorForm();

    const validForm = validationForm(values, setErrorForm);

    if (!validForm) return;

    const result = await fetchActivate(setLoading, values, params.token);

    if (result) {
      setValues({
        email: "",
        password: "",
        repeatPassword: ""
      });
      const result = await alertSwalConfirmRedirectionToLogin(iconActivate);

      if (result.isConfirmed) navigate("/admin/login");
    }

    return;
  };

  return (
    <>
      {validToken && !loadingValidation && (
        <div className={styles.containActivate}>
          <div className={styles.content}>
            <h3>
              <img className={styles.iconActivate} src={iconActivate} />
              Cree su contraseña para activar su usuario
            </h3>

            <form onSubmit={(event) => handleSubmit(event)}>
              <div className={styles.columnInput}>
                <label>Confirmar correo:</label>
                <input
                  autoComplete="off"
                  name="email"
                  maxLength={40}
                  onChange={(event) =>
                    setValues({ ...values, email: event.target.value.trim() })
                  }
                  placeholder="Ingrese correo"
                  type="text"
                  value={values.email}
                />
                {errorForm && errorForm.includes("correo") && (
                  <p>{errorForm}</p>
                )}
              </div>

              <Passwords
                values={values}
                setValues={setValues}
                errorForm={errorForm}
              />

              <button
                disabled={loading}
                className={styles.activate}
                type="submit"
              >
                {loading ? "Activando..." : "Activar"}
              </button>
            </form>

            <div className={styles.footer}>
              <img src={iconLogo}></img>
              <span>IndiceDelitosMontevideo</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
