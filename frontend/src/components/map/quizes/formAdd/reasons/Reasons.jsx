import styles from "./Reasons.module.css";
import { useEffect } from "react";
import { useFormQuiz } from "../../../../../contexts/quizesContext/FormAddQuizContext";
import { Loading } from "../../../loading/Loading";
import { NotData } from "../notData/NotData";
import Switch from "react-switch";

export const Reasons = ({ handleChange }) => {
  const { getAllTypeCrimes, allTypeCrimes, loadingCrimes, valuesForm } =
    useFormQuiz();

  useEffect(() => {
    if (allTypeCrimes) return;
    getAllTypeCrimes();
  }, []);

  return (
    <div className={styles.reasons}>
      <label>Tipos de crimenes que ocurren (opcional):</label>
      {loadingCrimes && <Loading />}
      {!loadingCrimes && !allTypeCrimes && <NotData />}
      {!loadingCrimes && allTypeCrimes && (
        <ul>
          {valuesForm.reasons &&
            allTypeCrimes.map((crime, index) => (
              <li key={index}>
                <Switch
                  height={20}
                  width={48}
                  boxShadow="2px 2px 2px #666666ff"
                  uncheckedIcon={false}
                  onColor="#3dcfe2ff"
                  onChange={() =>
                    handleChange({ name: "reasons", value: crime.category })
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
