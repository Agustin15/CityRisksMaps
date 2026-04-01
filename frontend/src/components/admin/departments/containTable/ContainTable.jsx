import styles from "./ContainTable.module.css";
import { LoadData } from "./LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { FooterTable } from "./footerTable/FooterTable";
import { Pagination } from "./pagination/Pagination";

export const ContainTable = () => {
  return (
    <div className={styles.containTable}>
      <LoadData route={"/department/departmentsOffset"} offset={0} />
      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>ID Departamento</th>
              <th>Nombre</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable msj={"Cargando departamentos..."} colSpan={3} />
        </table>
      </div>
      <Pagination route={"/department/departmentsOffset"} />
    </div>
  );
};
