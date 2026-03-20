import styles from "./FooterTable.module.css";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";

export const FooterTable = ({msj}) => {
  const { registers, error, elementNotFound, loading } = useCrud();

  return (
    <tfoot>
      {elementNotFound == true && (
        <tr>
          <td className={styles.loading} rowSpan={3} colSpan={3}>
            <h3>Elemento no encontrado</h3>
          </td>
        </tr>
      )}
      {loading == true && (
        <tr>
          <td className={styles.loading} rowSpan={3} colSpan={3}>
            <h3>{msj}</h3>
          </td>
        </tr>
      )}
      {loading == false && !registers && (
        <tr>
          <td className={styles.noData} rowSpan={3} colSpan={3}>
            <h3>{error}</h3>
          </td>
        </tr>
      )}
    </tfoot>
  );
};
