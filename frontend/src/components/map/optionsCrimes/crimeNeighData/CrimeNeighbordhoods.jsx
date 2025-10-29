import styles from "./CrimeNeighbordhoods.module.css";
import iconKill from "../../../../assets/img/kill.png";
import iconTheft from "../../../../assets/img/theft.png";
import iconHoldup from "../../../../assets/img/holdup.png";
import { useEffect, useState } from "react";
import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";
import { NotData } from "./notData/NotData";
import { Loading } from "./loading/Loading";
import { Table } from "./table/Table";

export const CrimeNeighbordhoods = ({ categoryCrime, setCrimeSelected }) => {
  const {
    getNeighborhoodsCrimeByYear,
    getYearsNeighborhoodsCrime,
    loadingYears,
    loadingNeighborhoodsCrime
  } = useZoneCrimes();
  const [neighborhoodsCrimeByYear, setNeighborhoodsCrimeByYear] = useState();
  const [years, setYears] = useState();
  const [yearSelected, setYearSelected] = useState();

  useEffect(() => {
    loadCrimeDataNeighborhoods();
  }, []);

  const loadCrimeDataNeighborhoods = async () => {
    let years = await getYearsNeighborhoodsCrime(categoryCrime);

    if (years) {
      setYearSelected(years[0].year);
      setYears(years);

      let neighborhoodsCrime = await getNeighborhoodsCrimeByYear(
        years[0].year,
        categoryCrime
      );

      if (neighborhoodsCrime) setNeighborhoodsCrimeByYear(neighborhoodsCrime);
    }
  };

  return (
    <div className={styles.containData}>
      <div className={styles.header}>
        <div className={styles.close}>
          <button onClick={() => setCrimeSelected()}>x</button>
        </div>
        <div className={styles.title}>
          <h3>{categoryCrime}s</h3>
          <img
            src={
              categoryCrime == "Hurto"
                ? iconTheft
                : categoryCrime == "Rapiña"
                ? iconHoldup
                : categoryCrime == "Asesinato"
                ? iconKill
                : ""
            }
          ></img>
        </div>
      </div>

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
          <ul className={styles.years}>
            {years.map((yearObject, index) => (
              <li key={index}>
                <button
                  className={
                    yearObject.year == yearSelected
                      ? styles.yearSelected
                      : styles.yearUnselected
                  }
                >
                  {yearObject.year}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {neighborhoodsCrimeByYear && (
        <Table neighborhoodsCrimeByYear={neighborhoodsCrimeByYear} />
      )}
    </div>
  );
};
