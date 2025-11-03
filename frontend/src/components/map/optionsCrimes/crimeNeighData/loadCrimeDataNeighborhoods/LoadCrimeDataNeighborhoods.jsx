import styles from "./LoadCrimeDataNeighborhoods.module.css";
import { NotData } from "../notData/NotData";
import { Loading } from "../loading/Loading";
import { References } from "../references/References";
import { FilterYears } from "../filterYears/FilterYears";
import { useEffect } from "react";
import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext";
import { useState } from "react";

export const LoadCrimesInNeighborhoods = ({
  setNeighborhoodsCrimeByYear,
  categoryCrime
}) => {
  const [showReferences, setShowReferences] = useState(false);
  const [years, setYears] = useState();
  const [yearSelected, setYearSelected] = useState();

  const {
    getNeighborhoodsCrimeByYear,
    getYearsNeighborhoodsCrime,
    createPolygonsNeighbordhood,
    loadingYears
  } = useZoneCrimes();

  const loadCrimeDataNeighborhoods = async (
    setNeighborhoodsCrimeByYear,
    setYearSelected,
    setYears
  ) => {
    let years = await getYearsNeighborhoodsCrime(categoryCrime);

    if (years) {
      setYearSelected(years[0].year);
      setYears(years);

      let neighborhoodsCrime = await getNeighborhoodsCrimeByYear(
        years[0].year,
        categoryCrime
      );

      if (neighborhoodsCrime) {
        setNeighborhoodsCrimeByYear(neighborhoodsCrime);
        createPolygonsNeighbordhood(neighborhoodsCrime, categoryCrime);
      }
    }
  };

  useEffect(() => {
    loadCrimeDataNeighborhoods(
      setNeighborhoodsCrimeByYear,
      setYearSelected,
      setYears
    );
  }, []);

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

          <div className={styles.containReferences}>
            <References categoryCrime={categoryCrime} />
          </div>

          <FilterYears years={years} yearSelected={yearSelected} />
        </>
      )}
    </div>
  );
};
