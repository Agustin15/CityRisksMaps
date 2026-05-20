import styles from "./ContainTable.module.css";
import { LoadData } from "../../departments/containTable/LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { FooterTable } from "../../departments/containTable/footerTable/FooterTable";

export const ContainTable = () => {
  return (
    <div className={styles.containTable}>
      <LoadData route={"/crime/crimes"} />
      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Creacion</th>
              <th>Ultima modificacion</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable msj={"Cargando categoria de delitos..."} colSpan={4} />
        </table>
      </div>
    </div>
  );
};
