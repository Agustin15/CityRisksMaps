import styles from "./ListUserQuizes.module.css";
import iconQuizes from "../../../../assets/img/quizes.png";
import { VerifyEmail } from "../verifyEmail/VerifyEmail";
import { VerifyProvider } from "../../../../contexts/VerifyContext";
import { Filter } from "./filter/Filter";
import { useCookies } from "react-cookie";
import { useQuizes } from "../../../../contexts/quizesContext/QuizesContext";
import { useListQuizes } from "../../../../contexts/quizesContext/ListQuizesContext";
import { useEffect } from "react";
import { List } from "./list/List";

export const ListUserQuizes = () => {
  const [cookies] = useCookies();
  const { years, loadInitData } = useListQuizes();
  const { setShowListQuizes } = useQuizes();

  useEffect(() => {
    if (years) return;
    loadInitData();
  }, []);

  return (
    <div className={styles.listUserQuizes}>
      <div className={styles.header}>
        <h3>Mi encuestas de percepcion</h3>
        <img src={iconQuizes}></img>
        <div className={styles.optionClose}>
          <button onClick={() => setShowListQuizes(false)}>X</button>
        </div>
      </div>

      {!cookies.email && (
        <VerifyProvider>
          <VerifyEmail />
        </VerifyProvider>
      )}

      {cookies.email && <Filter />}
      {cookies.email && years && <List />}
    </div>
  );
};
