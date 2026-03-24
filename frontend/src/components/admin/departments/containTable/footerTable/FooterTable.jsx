import styles from "./FooterTable.module.css";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";

export const FooterTable = ({ msj, colSpan }) => {
  const { registers, error, elementNotFound, loading, loadingYears } =
    useCrud();

  return (
    <tfoot>
      {elementNotFound == true && (
        <tr>
          <td className={styles.loading} colSpan={colSpan}>
            <h3>Elemento no encontrado</h3>
          </td>
        </tr>
      )}
      {(loading == true || loadingYears == true) && (
        <tr>
          <td className={styles.loading} colSpan={colSpan}>
            <h3>{msj}</h3>
          </td>
        </tr>
      )}
      {loading == false && loadingYears == false && !registers && (
        <tr>
          <td className={styles.noData} colSpan={colSpan}>
            <h3>{error}</h3>
          </td>
        </tr>
      )}
    </tfoot>
  );
};
