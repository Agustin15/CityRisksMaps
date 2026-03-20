import styles from "./ContainTable.module.css";
import { LoadData } from "./LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { FooterTable } from "./footerTable/FooterTable";
import { Pagination } from "./pagination/Pagination";

export const ContainTable = () => {
  return (
    <div className={styles.containTable}>
      <LoadData
        route={"/department/"}
        controller={"getDepartments"}
        controllerOffset={"getDepartmentsOffset"}
      />
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
          <FooterTable msj={"Cargando departamentos..."} />
        </table>
      </div>
      <Pagination
        endpoint={"/department/"}
        controller={"getDepartmentsOffset"}
      />
    </div>
  );
};
