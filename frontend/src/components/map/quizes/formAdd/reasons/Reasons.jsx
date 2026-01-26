import styles from "./Reasons.module.css";
import Switch from "react-switch";
import { useEffect } from "react";
import { useFormQuiz } from "../../../../../contexts/quizesContext/FormAddQuizContext";
import { Loading } from "../loading/Loading";
import { NotData } from "../notData/NotData";
import { handleChange } from "../functions.js";

export const Reasons = ({ valuesForm, setValuesForm }) => {
  const { getAllTypeCrimes, allTypeCrimes, loadingCrimes } = useFormQuiz();

  useEffect(() => {
    if (allTypeCrimes) return;
    getAllTypeCrimes();
  }, []);

  return (
    <div className={styles.reasons}>
      <label>Tipos de crimenes que ocurren (opcional):</label>
      {loadingCrimes && <Loading />}
      {!loadingCrimes && !allTypeCrimes && (
        <NotData
          msj={"No se encontraron registros de crimenes en el sistema"}
        />
      )}

      {!loadingCrimes && allTypeCrimes && (
        <ul>
          {valuesForm.reasons &&
            allTypeCrimes.map((crime, index) => (
              <li key={index}>
                <Switch
                  height={20}
                  width={window.innerWidth > 650 ? 48 : 44}
                  boxShadow="2px 2px 2px #666666ff"
                  uncheckedIcon={false}
                  onColor="#3dcfe2ff"
                  onChange={() =>
                    handleChange(
                      { name: "reasons", value: crime.category },
                      valuesForm,
                      setValuesForm
                    )
                  }
                  checked={valuesForm.reasons.find(
                    (reason) => reason == crime.category
                  )}
                ></Switch>
                {crime.category}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
