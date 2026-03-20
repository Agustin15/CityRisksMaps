import styles from "./ContainTable.module.css";
import { LoadData } from "../../departments/containTable/LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { Pagination } from "../../departments/containTable/pagination/Pagination";
import { FooterTable } from "../../departments/containTable/footerTable/FooterTable";

export const ContainTable = () => {
  return (
    <div className={styles.containTable}>
      <LoadData
        route={"/neighborhood/"}
        controller={"getNeighborhoods"}
        controllerOffset={"getNeighborhoodsOffset"}
      />
      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable msj={"Cargando barrios..."} />
        </table>
      </div>

      <Pagination
        route={"/neighborhood/"}
        controller={"getNeighborhoodsOffset"}
      />
    </div>
  );
};
