import styles from "./ContainTable.module.css";
import { LoadData } from "./LoadData";
import { BodyTable } from "./bodyTable/bodyTable";
import { FooterTable } from "./footerTable/FooterTable";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";

export const ContainTable = () => {
  const { fetchGet, pages, index, setIndex } = useCrud();

  const handleClickPage = (page) => {
    setIndex(page);
    let url =
      "/departments/" +
      JSON.stringify({
        option: "getDepartmentsOffset",
        offset: page * 10
      });
    fetchGet(url + params, "GET");
  };

  return (
    <div className={styles.containTable}>
      <LoadData />
      <table>
        <thead>
          <tr>
            <th>ID Departamento</th>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <BodyTable />
        <FooterTable />
      </table>

      <div className={styles.pagination}>
        <ul>
          {pages &&
            Array.from({ length: pages }, (v, index) => index).map((page) => (
              <li key={page}>
                <button
                  className={index == page ? styles.disabled : ""}
                  onClick={() => handleClickPage(page)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
