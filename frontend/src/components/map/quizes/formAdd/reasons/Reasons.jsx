import { useEffect } from "react";
import { useFormQuiz } from "../../../../../contexts/FormAddQuizContext";
import { Loading } from "../../../loading/Loading";
import { NotData } from "../notData/NotData";
import Switch from "react-switch";
import styles from "./Reasons.module.css";

export const Reasons = () => {
  const {
    fetchGetAllTypeCrimes,
    allTypeCrimes,
    loadingCrimes,
    setChecked,
    checked
  } = useFormQuiz();

  useEffect(() => {
    if (allTypeCrimes) return;
    fetchGetAllTypeCrimes();
  }, []);

  const handleChange = (category) => {
    if (checked.find((check) => check == category)) {
      setChecked(checked.filter((check) => check != category));
    } else {
      setChecked([...checked, category]);
    }
  };

  return (
    <div className={styles.reasons}>
      <label>Seleccione las razones:</label>
      {loadingCrimes && <Loading />}
      {!loadingCrimes && !allTypeCrimes && <NotData />}
      {!loadingCrimes && allTypeCrimes && (
        <ul>
          {checked &&
            allTypeCrimes.map((crime, index) => (
              <li key={index}>
                <Switch
                  height={20}
                  width={48}
                  boxShadow="2px 2px 2px #666666ff"
                  uncheckedIcon={false}
                  onColor="#3dcfe2ff"
                  onChange={() => handleChange(crime.category)}
                  checked={checked.find((check) => check == crime.category)}
                ></Switch>
                {crime.category}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
