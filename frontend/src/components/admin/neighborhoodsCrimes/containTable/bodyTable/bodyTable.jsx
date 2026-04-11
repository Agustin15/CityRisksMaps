import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconIncrease from "../../../../../assets/img/increase.png";
import iconChart from "../../../../../assets/img/chartline.png";
import iconDecrease from "../../../../../assets/img/decrease.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Chart } from "./chart/Chart";
// import { Edit } from "../edit/Edit";
// import { Delete } from "../delete/Delete";
import { useAuth } from "../../../../../contexts/adminContext/AuthContext";

export const BodyTable = () => {
  const [deleteItem, setDeleteItem] = useState(null);
  const [showChart, setShowChart] = useState(null);
  const { loading, registers } = useCrud();
  const { user } = useAuth();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((nhCrime, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{nhCrime.name}</td>
            <td>{nhCrime.quantity}</td>
            <td>{nhCrime.rate}</td>
            <td>
              <div className={styles.containIncrease}>
                {nhCrime.increase != null ? (
                  <span className={nhCrime.increase > 0 ? styles.increase : styles.decrease}>
                    {nhCrime.increase}%
                  </span>
                ) : (
                  "Sin datos"
                )}
                {nhCrime.increase != null && nhCrime.increase != 0 && (
                  <img
                    src={nhCrime.increase > 0 ? iconIncrease : iconDecrease}
                  ></img>
                )}
              </div>
            </td>
            <td>
              <div className={styles.options}>
                {user.rol == "Admin" && (
                  <>
                    <button
                      onClick={() => setDeleteItem(nhCrime.name)}
                      className={styles.delete}
                    >
                      <img src={iconDelete}></img>
                    </button>
                    <button
                      onClick={() => setShowChart(nhCrime.name)}
                      className={styles.chart}
                    >
                      <img src={iconChart}></img>
                    </button>
                  </>
                )}
              </div>
            </td>
            {showChart == nhCrime.name && (
              <td>
                {createPortal(
                  <Modal>
                    <Chart
                      neighborhoodCrime={nhCrime}
                      setShowChart={setShowChart}
                    />
                  </Modal>,
                  document.body
                )}
              </td>
            )}
          </tr>
        ))}
    </tbody>
  );
};
