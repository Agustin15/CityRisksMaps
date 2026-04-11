import styles from "./LoadCrimeDataNeighborhoods.module.css";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { Loading } from "../../loading/Loading";
import { References } from "../references/References";
import { FilterYears } from "../../filterYears/FilterYears";
import { Searcher } from "../searcher/Searcher";

export const LoadCrimesInNeighborhoods = ({
  categoryCrime,
  setElementSearchedNotFound
}) => {
  const { loadingYears, years } = useNeighborhoodsCrimes();

  return (
    <div className={styles.containDetails}>
      {loadingYears == true && <Loading />}

      {loadingYears == false && years && (
        <>
          <p>
            Los datos mostrados a continuacion son estadisticas de denuncias
            obtenidas de documentacion perteneciente a{" "}
            <a href="https://catalogodatos.gub.uy/dataset/ministerio-del-interior-delitos_denunciados_en_el_uruguay">
              AECA
            </a>
            , de esta forma la tasa de criminalidad esta basada en la cantidad
            de denuncias por cada numero de habitantes en los barrios.
          </p>

          <div className={styles.rowSearcher}>
            <References categoryCrime={categoryCrime} />
            <Searcher setElementSearchedNotFound={setElementSearchedNotFound} />
          </div>

          <FilterYears categoryCrime={categoryCrime} />
        </>
      )}
    </div>
  );
};
