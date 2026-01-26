import styles from "./FormAdd.module.css";
import { Reasons } from "./reasons/Reasons";
import { Perception } from "./perception/Perception";
import { VerifyEmail } from "../verifyEmail/VerifyEmail";
import { VerifyProvider } from "../../../../contexts/VerifyContext";
import { NotData } from "./notData/NotData";
import { Loading } from "./loading/Loading";
import { useFormQuiz } from "../../../../contexts/quizesContext/FormAddQuizContext";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export const FormAdd = () => {
  const [cookies] = useCookies();

  const {
    handleClose,
    handleSubmit,
    loadingNeigh,
    loading,
    allTypeCrimes,
    getNeighborhoodsNotUsed,
    neighborhoodsNotUsed,
    setValuesForm,
    valuesForm
  } = useFormQuiz();

  const handleChange = (event) => {
    let { name, value } = event;

    if (name == "reasons") {
      if (valuesForm.reasons.find((reason) => reason == value)) {
        setValuesForm({
          ...valuesForm,
          [name]: valuesForm.reasons.filter((reason) => reason != value)
        });
      } else {
        setValuesForm({
          ...valuesForm,
          [name]: [...valuesForm.reasons, value]
        });
      }
    } else {
      if (name == "perception") value = value == "secure" ? 1 : 0;

      setValuesForm({ ...valuesForm, [name]: value });
    }
  };

  useEffect(() => {
    if (neighborhoodsNotUsed) return;
    getNeighborhoodsNotUsed();
  }, []);

  return (
    <div className={styles.containForm}>
      <div className={styles.header}>
        <h3>Encuesta de percepcion</h3>
        <div className={styles.optionClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {!cookies.email ? (
          <VerifyProvider>
            <VerifyEmail />
          </VerifyProvider>
        ) : (
          <label>Correo: {cookies.email}</label>
        )}

        {cookies.email && (
          <>
            {loadingNeigh && <Loading />}
            {!loadingNeigh && !neighborhoodsNotUsed && (
              <NotData msj={"No hay registros de barrios en el sistema"} />
            )}

            {neighborhoodsNotUsed && loadingNeigh == false && (
              <div className={styles.column}>
                <label>Barrio:</label>
                <select
                  onChange={(event) => handleChange(event.target)}
                  name="neighborhoodSelected"
                >
                  {neighborhoodsNotUsed.map((neighborhood, index) => (
                    <option key={index} value={neighborhood.name}>
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Perception handleChange={handleChange} />

            <Reasons handleChange={handleChange} />

            {allTypeCrimes && neighborhoodsNotUsed && (
              <button type="submit" className={styles.send} disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
};
