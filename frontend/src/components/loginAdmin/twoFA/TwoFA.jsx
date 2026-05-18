import styles from "./TwoFA.module.css";
import logo from "../../../assets/img/logo.png";
import iconForbidden from "../../../assets/img/forbidden.png";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Keyboard } from "./keyboard/Keyboard";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { useTwoStepAuth } from "../../../contexts/adminContext/TwoStepAuthContext";
import { Helmet } from "react-helmet-async";
import { Form } from "./form/Form";

export const TwoFA = () => {
  const params = useParams();

  const {
    handleClick,
    validateTwo2FAToken,
    setErrorAuth,
    errorAuth,
    loadingValidation,
    setLoadingValidation
  } = useTwoStepAuth();

  useEffect(() => {
    setLoadingValidation(true);
    loadValidation();
  }, []);

  const loadValidation = async () => {
    try {
      await validateTwo2FAToken(params.token);
    } catch (error) {
      setErrorAuth(error.message);
    } finally {
      setLoadingValidation(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login-Administracion</title>
        <meta name="robots" content="noindex"></meta>
      </Helmet>

      {!loadingValidation && (
        <div className={styles.twoFA}>
          <div className={styles.containForm}>
            <div className={styles.header}>
              <div className={styles.title}>
                <img src={logo}></img>
                <h3>Indice delitos Montevideo</h3>
              </div>
            </div>

            {errorAuth.length == 0 ? (
              <p>
                Ingresa el codigo que le enviamos al correo agus20m05@gmail.com
              </p>
            ) : (
              <p className={styles.errorAuth}>
                {errorAuth}
                <img src={iconForbidden}></img>
              </p>
            )}

            {errorAuth.length == 0 && <Form />}
          </div>
        </div>
      )}
    </>
  );
};
