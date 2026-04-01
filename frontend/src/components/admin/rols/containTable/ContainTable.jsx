import styles from "./ContainTable.module.css";
import { LoadData } from "../../departments/containTable/LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { FooterTable } from "../../departments/containTable/footerTable/FooterTable";

export const ContainTable = () => {
  return (
    <div className={styles.containTable}>
      <LoadData route={"/role/allRols"} />
      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>ID rol</th>
              <th>nombre</th>
              <th>Creacion</th>
              <th>Ultima modificacion</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable msj={"Cargando roles del sistema..."} colSpan={5} />
        </table>
      </div>
    </div>
  );
};
