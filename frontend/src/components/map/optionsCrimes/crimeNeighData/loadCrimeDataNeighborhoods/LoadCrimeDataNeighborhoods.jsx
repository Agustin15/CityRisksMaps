import styles from "./LoadCrimeDataNeighborhoods.module.css";
import { NotData } from "../notData/NotData";
import { Loading } from "../loading/Loading";
import { References } from "../references/References";
import { FilterYears } from "../filterYears/FilterYears";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";

export const LoadCrimesInNeighborhoods = ({ categoryCrime }) => {
  const { loadingYears, years } = useZoneCrimes();

  return (
    <div className={styles.containDetails}>
      {loadingYears && <Loading />}

      {!loadingYears && !years && <NotData />}

      {!loadingYears && years && (
        <>
          <p>
            Los datos mostrados a continuacion son estadisticas de denuncias
            obtenidas de documentacion perteneciente a
            <a href="https://www.gub.uy/"> GUB.UY</a>, de esta forma la tasa de
            criminalidad esta basada en la cantidad de denuncias por cada numero
            de habitantes en los barrios, por lo que puede haber discrepancias
            con la verdadera realidad del riesgo en cada zona.
          </p>

          <References categoryCrime={categoryCrime} />

          <FilterYears categoryCrime={categoryCrime} />
        </>
      )}
    </div>
  );
};
