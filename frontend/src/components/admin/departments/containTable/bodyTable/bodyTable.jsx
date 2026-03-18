import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconNeighborhoods from "../../../../../assets/img/neighborhoods.png";
import { useState } from "react";

export const BodyTable = ({ loading, error, departments }) => {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <tbody>
      {loading == true && (
        <td className={styles.loading} rowSpan={3} colSpan={3}>
          <h3>Cargando departamentos...</h3>
        </td>
      )}
      {loading == false && !departments && (
        <td className={styles.noData} rowSpan={3} colSpan={3}>
          <h3>{error}</h3>
        </td>
      )}
      {departments &&
        loading == false &&
        departments.map((department, index) => (
          <tr key={index} className={index == 0 ? styles.trGray : ""}>
            <td>{department.idDepartment}</td>
            <td>{department.name}</td>
            <td>
              <div className={styles.options}>
                <button className={styles.delete}>
                  <img src={iconDelete}></img>
                </button>
                <button
                  onClick={() => setShowEdit(true)}
                  className={styles.edit}
                >
                  <img src={iconEdit}></img>
                </button>
                <button className={styles.neighborhoods}>
                  <img src={iconNeighborhoods}></img>
                </button>
              </div>
            </td>
          </tr>
        ))}
    </tbody>
    
  );
};
