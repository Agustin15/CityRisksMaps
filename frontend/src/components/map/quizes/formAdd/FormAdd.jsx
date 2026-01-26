import styles from "./FormAdd.module.css";
import { useFormQuiz } from "../../../../contexts/quizesContext/FormAddQuizContext";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { Reasons } from "./reasons/Reasons";
import { Perception } from "./perception/Perception";
import { Neighborhood } from "./neighborhood/Neighborhood";
import { VerifyEmail } from "../verifyEmail/VerifyEmail";
import { VerifyProvider } from "../../../../contexts/VerifyContext";
import { NotData } from "./notData/NotData";
import { Loading } from "./loading/Loading";

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
  const { newQuiz } = useQuizes();

  useEffect(() => {
    if (neighborhoodsNotUsed || newQuiz != true) return;
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
        {!cookies.email && (
          <VerifyProvider>
            <VerifyEmail />
          </VerifyProvider>
        )}

        {cookies.email && (
          <>
            <label>Correo: {cookies.email}</label>

            {loadingNeigh && <Loading />}

            {loadingNeigh == false &&
              !neighborhoodsNotUsed &&
              newQuiz == true && (
                <NotData msj={"No hay registros de barrios en el sistema"} />
              )}

            {loadingNeigh == false &&
              (neighborhoodsNotUsed || newQuiz != true) && (
                <Neighborhood
                  valuesForm={valuesForm}
                  setValuesForm={setValuesForm}
                />
              )}

            <Perception valuesForm={valuesForm} setValuesForm={setValuesForm} />

            <Reasons valuesForm={valuesForm} setValuesForm={setValuesForm} />

            {allTypeCrimes && (neighborhoodsNotUsed || newQuiz != true) && (
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
