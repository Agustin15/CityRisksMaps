import styles from "./ContainTable.module.css";
import { LoadData } from "../../departments/containTable/LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { FooterTable } from "../../departments/containTable/footerTable/FooterTable";
import { Pagination } from "../../departments/containTable/pagination/Pagination";
import { useParams } from "react-router";

export const ContainTable = () => {
  const { roleName } = useParams();
  const route = !roleName
    ? "/user/usersOffset"
    : `/user/usersByRoleOffset/${roleName}`;

  return (
    <div className={styles.containTable}>
      <LoadData route={route} offset={0} />
      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              <th>ID usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Creacion</th>
              <th>Ultima modificacion</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <BodyTable />
          <FooterTable msj={"Cargando usuarios del sistema..."} colSpan={6} />
        </table>
      </div>
      <Pagination route={route} />
    </div>
  );
};
