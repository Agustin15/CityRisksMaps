import styles from "./LoadCrimeDataNeighborhoods.module.css";
import iconIncreaseColumnChart from "../../../../assets/img/increaseLineChart.png";
import { useNeighborhoodsCrimes } from "../../../../contexts/neighborhoodsCrimesContext/NeighborhoodsCrimesContextContext";
import { Loading } from "../../loading/Loading";
import { References } from "../references/References";
import { FilterYears } from "../../filterYears/FilterYears";
import { Searcher } from "../searcher/Searcher";
import { ChartIncreaseOfCrime } from "../chartIncreaseOfCrime/ChartIncreaseOfCrime";

export const LoadCrimesInNeighborhoods = ({
  categoryCrime,
  setElementSearchedNotFound,
  setShowChart
}) => {
  const { loadingYears, years } = useNeighborhoodsCrimes();

  return (
    <div className={styles.containDetails}>
      {loadingYears == true && <Loading />}

      {loadingYears == false && years && (
        <>
          <p>
            Los datos mostrados a continuacion son estadisticas de denuncias de
            delitos consumados, obtenidas de documentacion perteneciente al{" "}
            <a href="https://catalogodatos.gub.uy/dataset/ministerio-del-interior-delitos_denunciados_en_el_uruguay">
              Área de Estadística y Criminología Aplicada (AECA)
            </a>
            .
          </p>

          <div className={styles.rowSearcher}>
            <References categoryCrime={categoryCrime} />
            <Searcher setElementSearchedNotFound={setElementSearchedNotFound} />
          </div>
          <div className={styles.rowYears}>
            <FilterYears categoryCrime={categoryCrime} />
            <button
              onClick={() => setShowChart(true)}
              className={styles.btnIncrease}
            >
              <img src={iconIncreaseColumnChart}></img>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
