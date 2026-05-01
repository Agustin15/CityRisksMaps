import styles from "./Options.module.css";
import iconChart from "../../../../../../assets/img/chartline.png";
import iconDelete from "../../../../../../assets/img/delete.png";
import { useState } from "react";
import { Modal } from "../../../../modal/Modal";
import { Chart } from "../chart/Chart";
import { createPortal } from "react-dom";

export const Options = ({ user, nhCrime }) => {
  const [deleteItem, setDeleteItem] = useState(null);
  const [showChart, setShowChart] = useState(null);

  return (
    <>
      <td>
        <div className={styles.options}>
          {user.rol == "Admin" && (
            <button
              onClick={() => setDeleteItem(nhCrime.name)}
              className={styles.delete}
            >
              <img src={iconDelete}></img>
            </button>
          )}
          <button
            onClick={() => setShowChart(nhCrime.name)}
            className={styles.chart}
          >
            <img src={iconChart}></img>
          </button>
        </div>
      </td>

      {showChart == nhCrime.name && (
        <td>
          {createPortal(
            <Modal>
              <Chart neighborhoodCrime={nhCrime} setShowChart={setShowChart} />
            </Modal>,
            document.body
          )}
        </td>
      )}
    </>
  );
};
