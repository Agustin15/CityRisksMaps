import styles from "./activateUser.module.css";
import iconActivate from "../../../assets/img/activateUser.png";
import iconLogo from "../../../assets/img/logo.png";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Passwords } from "./password/Passwords";
import { useActivateUser } from "../../../contexts/adminContext/ActivateUserContext";

export const ActivateUser = () => {
  const params = useParams();
  const {
    fetchValidateToken,
    handleSubmit,
    values,
    setValues,
    validToken,
    loading,
    loadingValidation,
    errorForm
  } = useActivateUser();

  useEffect(() => {
    if (params.token) {
      fetchValidateToken(params.token);
    }
  }, []);

  return (
    <>
      {validToken && !loadingValidation && (
        <div className={styles.containActivate}>
          <div className={styles.content}>
            <h3>
              <img className={styles.iconActivate} src={iconActivate} />
              Cree su contraseña para activar su usuario
            </h3>

            <form onSubmit={(event) => handleSubmit(event, params.token)}>
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
