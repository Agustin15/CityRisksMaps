import styles from "./ContainTable.module.css";
import { LoadData } from "../../departments/containTable/LoadData";
import { Pagination } from "../../departments/containTable/pagination/Pagination";
import { BodyTable } from "./bodyTable/BodyTable";
import { FooterTable } from "../../departments/containTable/footerTable/FooterTable";
import { useEffect } from "react";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";
import { Filter } from "./filter/Filter";

export const ContainTable = () => {
  const {
    fetchGet,
    setRegisters,
    setPages,
    setIndex,
    crimes,
    setCrimes,
    setCrimeSelected,
    crimeSelected,
    yearSelected,
    loadYears,
    loadingFilter,
    setLoadingFilter
  } = useCrud();

  useEffect(() => {
    const getCrimes = async () => {
      const categoryCrimes = await fetchGet(
        "/crimeAdmin/crimes",
        setLoadingFilter
      );
      if (categoryCrimes) {
        setCrimes(categoryCrimes);
        setCrimeSelected(categoryCrimes[0].category);
      }
    };

    getCrimes();
  }, []);

  useEffect(() => {
    if (!crimeSelected) return;
    const loadYearsData = async () => {
      const years = await loadYears(
        "/neighborhoodCrimeAdmin/yearsNeighborhoodsCrime/" + crimeSelected
      );

      if (years) {
        setIndex(0);
      } else {
        setRegisters();
        setPages();
      }
    };

    loadYearsData();
  }, [crimeSelected]);

  return (
    <div className={styles.containTable}>
      {crimeSelected && yearSelected && !loadingFilter && (
        <LoadData
          route={"/neighborhoodCrimeAdmin/neighborhoodsCrimesByYearOffset"}
          offset={0}
        />
      )}

      {crimes && <Filter crimes={crimes} />}
      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>Barrio</th>
              <th>Cantidad</th>
              <th>Tasa</th>
              <th>Crecimiento</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable
            msj={"Cargando indice de delitos en barrios..."}
            colSpan={5}
          />
        </table>
      </div>

      <Pagination
        route={"/neighborhoodCrimeAdmin/neighborhoodsCrimesByYearOffset"}
      />
    </div>
  );
};
