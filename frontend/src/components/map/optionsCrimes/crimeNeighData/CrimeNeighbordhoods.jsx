import styles from "./CrimeNeighbordhoods.module.css";
import iconKill from "../../../../assets/img/kill.png";
import iconTheft from "../../../../assets/img/theft.png";
import iconHoldup from "../../../../assets/img/holdup.png";
import { useEffect, useState } from "react";
import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";
import { NotData } from "./notData/NotData";
import { Loading } from "./loading/Loading";

export const CrimeNeighbordhoods = ({ categoryCrime }) => {
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

      {loadingYears && <Loading />}

      {!loadingYears && !years && <NotData />}

      {!loadingYears && years && (
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
      )}
    </div>
  );
};
