import styles from "./LoadDataQuizes.module.css";
import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";
import { Loading } from "../../loading/Loading";
import { NotData } from "../../notData/NotData";
import { FilterYears } from "../../filterYears/FilterYears";
import { References } from "../references/References";

export const LoadDataQuizes = () => {
  const { loadingYears, years } = useZoneCrimes();

  return (
    <div className={styles.containDetails}>
      {loadingYears && <Loading />}

      {!loadingYears && !years && <NotData />}

      {!loadingYears && years && (
        <>
          <p>
            Los datos mostrados a continuacion son resultados de los opiniones
            de los usuarios sobre cada barrio, votando si es seguro o no.
          </p>

          <References/>

          <FilterYears />
        </>
      )}
    </div>
  );
};
