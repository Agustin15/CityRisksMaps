import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconChart from "../../../../../assets/img/chartLine.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { useParams } from "react-router";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Edit } from "../edit/Edit";
import { Delete } from "../delete/Delete";
import { Chart } from "./chart/Chart";

export const BodyTable = () => {
  const [editPopulation, setEditPopulation] = useState(null);
  const [deletePopulation, setDeletePopulation] = useState(null);
  const [chartPopulation, setChartPopulation] = useState(null);
  const { loading, registers } = useCrud();

  const params = useParams();

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((population, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{population.idPopulation}</td>
            <td>{population.nameNeighborhood}</td>
            <td>{population.quantity.toLocaleString()}</td>
            <td>{population.year}</td>

            <td>
              <div className={styles.options}>
                {!params.controller && (
                  <>
                    <button
                      onClick={() =>
                        setDeletePopulation(population.idPopulation)
                      }
                      className={styles.delete}
                    >
                      <img src={iconDelete}></img>
                    </button>

                    <button
                      onClick={() => setEditPopulation(population.idPopulation)}
                      className={styles.edit}
                    >
                      <img src={iconEdit}></img>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setChartPopulation(population.neighborhood)}
                  className={styles.chart}
                >
                  <img src={iconChart}></img>
                </button>
              </div>
            </td>

            {editPopulation == population.idPopulation &&
              createPortal(
                <Modal>
                  <Edit
                    population={population}
                    setEditPopulation={setEditPopulation}
                  />
                </Modal>,
                document.body
              )}
            {deletePopulation == population.idPopulation &&
              createPortal(
                <Modal>
                  <Delete
                    population={population}
                    setDeletePopulation={setDeletePopulation}
                  />
                </Modal>,
                document.body
              )}
            {chartPopulation == population.neighborhood &&
              createPortal(
                <Modal>
                  <Chart
                    idNeighborhood={population.neighborhood}
                    setChartPopulation={setChartPopulation}
                  />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
