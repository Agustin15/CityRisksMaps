import styles from "./BodyTable.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconPopulation from "../../../../../assets/img/populationsTwo.png";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Edit } from "../edit/Edit";
import { Delete } from "../delete/Delete";

export const BodyTable = () => {
  const [editNeighborhood, setEditNeighborhood] = useState(null);
  const [deleteNeighborhood, setDeleteNeighborhood] = useState(null);
  const { loading, registers } = useCrud();
  let navigate = useNavigate();
  const params = useParams();

  const handleClick = (neighborhood) => {
    navigate(
      "/admin/poblaciones/barrio/getPopulationsOffsetByNeighborhood/" +
        neighborhood.idNeighborhood
    );
  };

  return (
    <tbody>
      {registers &&
        loading == false &&
        registers.map((neighborhood, index) => (
          <tr key={index} className={index % 2 == 0 ? styles.trGray : ""}>
            <td>{neighborhood.idNeighborhood}</td>
            <td>{neighborhood.nameNeighborhood}</td>
            <td>{neighborhood.nameDepartment}</td>
            <td>
              <div className={styles.options}>
                {!params.controller && (
                  <>
                    <button
                      onClick={() =>
                        setDeleteNeighborhood(neighborhood.idNeighborhood)
                      }
                      className={styles.delete}
                    >
                      <img src={iconDelete}></img>
                    </button>

                    <button
                      onClick={() =>
                        setEditNeighborhood(neighborhood.idNeighborhood)
                      }
                      className={styles.edit}
                    >
                      <img src={iconEdit}></img>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleClick(neighborhood)}
                  className={styles.population}
                >
                  <img src={iconPopulation}></img>
                </button>
              </div>
            </td>

            {editNeighborhood == neighborhood.idNeighborhood &&
              createPortal(
                <Modal>
                  <Edit
                    neighborhood={neighborhood}
                    setEditNeighborhood={setEditNeighborhood}
                  />
                </Modal>,
                document.body
              )}
            {deleteNeighborhood == neighborhood.idNeighborhood &&
              createPortal(
                <Modal>
                  <Delete
                    neighborhood={neighborhood}
                    setDeleteNeighborhood={setDeleteNeighborhood}
                  />
                </Modal>,
                document.body
              )}
          </tr>
        ))}
    </tbody>
  );
};
