import styles from "./ContainTable.module.css";
import { LoadData } from "../../departments/containTable/LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { Pagination } from "../../departments/containTable/pagination/Pagination";
import { FooterTable } from "../../departments/containTable/footerTable/FooterTable";
import { useParams } from "react-router";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";
import { useEffect } from "react";

export const ContainTable = () => {
  const params = useParams();
  const { yearSelected, loadYears, years } = useCrud();

  useEffect(() => {
    if (years || params.neighborhoodName) return;
    loadYears("/population/populationsYears");
  }, []);

  let route =
    "/population/" +
    (!params.neighborhoodName
      ? "populationsOffsetYear"
      : "populationsOffsetNeighborhood/" +
        encodeURIComponent(params.neighborhoodName));

  return (
    <div className={styles.containTable}>
      {(yearSelected || params.neighborhoodName) && (
        <LoadData route={route} offset={0} />
      )}

      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>Id Poblacion</th>
              <th>Barrio</th>
              <th>Habitantes</th>
              <th>Año</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable
            msj={"Cargando poblaciones de barrios ..."}
            colSpan={5}
          />
        </table>
      </div>

      <Pagination route={route} />
    </div>
  );
};
