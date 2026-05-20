const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import style from "./EmailConfirmed.module.css";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import iconEmailConfirmed from "../../../assets/img/emailConfirmed.png";
import iconEmailNotConfirmed from "../../../assets/img/emailNotConfirmed.png";
import { Helmet } from "react-helmet-async";

export const EmailConfirmed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let params = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmEmail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          LOCALHOST_BACKEND + "/admin/confirmEmail/",
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${params.token}`
            }
          }
        );
        const result = await response.json();

        if (!response.ok) {
          if (response.status == 403) navigate("/admin/permiso-denegado/");
          else if (response.status == 401) navigate("/admin/no-autorizado/");
          else throw new Error(result.messageError);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmEmail();
  }, []);

  return (
    <>
      {!loading && (
        <div className={style.emailConfirmed}>
          <Helmet>
            <title>Confirmar correo</title>
            <meta name="robots" content="noindex"></meta>
          </Helmet>
          <div className={style.wave}>
            <img
              src={error == null ? iconEmailConfirmed : iconEmailNotConfirmed}
            ></img>
            <h3>
              {error == null
                ? "¡Bien!,Tu correo electronico se ha verificado exitosamente"
                : "¡Ups!, hubo no se pudo verificar el nuevo correo electronico"}
            </h3>
          </div>
          <div className={style.message}>
            {error == null ? (
              <p>
                Gracias a esto,hemos confirmado que eres tu quien ha decidido
                cambiar el correo para loguearse en nuestro sistema
              </p>
            ) : (
              <p>{error}</p>
            )}

            <button
              className={error == null ? style.btnOk : style.btnError}
              onClick={() => navigate("/admin/login/")}
            >
              {error == null ? "Iniciar sesion" : "Volver al logueo"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
