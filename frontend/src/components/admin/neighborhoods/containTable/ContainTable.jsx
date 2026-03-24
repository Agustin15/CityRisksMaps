import styles from "./ContainTable.module.css";
import { LoadData } from "../../departments/containTable/LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { Pagination } from "../../departments/containTable/pagination/Pagination";
import { FooterTable } from "../../departments/containTable/footerTable/FooterTable";
import { useParams } from "react-router";

export const ContainTable = () => {
  const params = useParams();

  let controller = !params.controller
    ? "getNeighborhoodsOffset"
    : params.controller;

  return (
    <div className={styles.containTable}>
      <LoadData route={"/neighborhood/"} controller={controller} />

      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>Id Barrio</th>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable msj={"Cargando barrios..."} colSpan={4} />
        </table>
      </div>

      <Pagination route={"/neighborhood/"} controller={controller} />
    </div>
  );
};
